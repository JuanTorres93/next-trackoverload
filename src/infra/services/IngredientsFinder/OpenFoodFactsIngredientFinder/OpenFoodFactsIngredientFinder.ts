import { InfrastructureError } from '@/domain/common/errors';
import {
  IngredientFinder,
  IngredientFinderResult,
} from '@/domain/services/IngredientFinder.port';
import { RateLimiter } from '@/domain/services/RateLimiter.port';

type OpenFoodFactProduct = {
  _id: string;
  product_name: string;
  product_name_en?: string;
  nutriments: {
    'energy-kcal_100g': number;
    proteins_100g: number;
  };
  image_thumb_url?: string;
  image_front_url?: string;
};

// DOCS: https://openfoodfacts.github.io/openfoodfacts-server/api/
export const READ_RATE_LIMITS = {
  // GET /api/v*/product
  productQueries: {
    requests: 100,
    perMinutes: 1,
  },
  // GET /api/v*/search or GET /cgi/search.pl
  searchQueries: {
    requests: 10,
    perMinutes: 1,
  },
  // such as /categories, /label/organic, /ingredient/salt, /category/breads,...
  facetQueries: {
    requests: 2,
    perMinutes: 1,
  },
};

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://world.openfoodfacts.org'
    : 'https://world.openfoodfacts.net';

let authHeader;
if (['test', 'development'].includes(process.env.NODE_ENV))
  authHeader = {
    Authorization: 'Basic' + btoa('off:off'),
  };

if (process.env.NODE_ENV === 'production')
  authHeader = {
    'User-Agent': process.env.OPEN_FOOD_FACTS_USER_AGENT,
  };

if (!authHeader) {
  throw new InfrastructureError(
    'OpenFoodFactsIngredientFinder: Missing Authorization header configuration. Is NODE_ENV set correctly?',
  );
}

export class OpenFoodFactsIngredientFinder implements IngredientFinder {
  private readonly searchRateLimiter: RateLimiter;
  private readonly barcodeRateLimiter: RateLimiter;
  private readonly clientId: string;

  constructor(
    searchRateLimiter: RateLimiter,
    barcodeRateLimiter: RateLimiter,
    clientId: string,
  ) {
    this.searchRateLimiter = searchRateLimiter;
    this.barcodeRateLimiter = barcodeRateLimiter;
    this.clientId = clientId;
  }

  async findIngredientsByFuzzyName(name: string) {
    if (await this.searchRateLimiter.isRateLimited(this.clientId)) {
      // TODO throw RateLimitError instead
      throw new InfrastructureError(
        'OpenFoodFactsIngredientFinder: Rate limit exceeded for search queries',
      );
    }

    const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(
      name,
    )}&search_simple=1&action=process&json=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...authHeader! },
    });

    this.searchRateLimiter.recordRequest(this.clientId);

    if (!response.ok) {
      throw new InfrastructureError(
        `OpenFoodFactsIngredientFinder: Failed to fetch ingredients by name "${name}". Status: ${response.status}`,
      );
    }

    const json = await response.json();

    return this.mapOpenFoodFactProductToIngredientResult(json.products || []);
  }

  async findIngredientsByBarcode(barcode: string) {
    if (await this.barcodeRateLimiter.isRateLimited(this.clientId)) {
      // TODO throw RateLimitError instead
      throw new InfrastructureError(
        'OpenFoodFactsIngredientFinder: Rate limit exceeded for barcode queries',
      );
    }

    const url = `${BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...authHeader! },
    });

    this.barcodeRateLimiter.recordRequest(this.clientId);

    if (!response.ok) {
      throw new InfrastructureError(
        `OpenFoodFactsIngredientFinder: Failed to fetch ingredients by barcode "${barcode}". Status: ${response.status}`,
      );
    }

    const json = await response.json();

    return this.mapOpenFoodFactProductToIngredientResult([json.product]);
  }

  private mapOpenFoodFactProductToIngredientResult(
    products: OpenFoodFactProduct[],
  ): IngredientFinderResult[] {
    const filteredProducts = products
      // Has name
      .filter(
        (product: OpenFoodFactProduct) =>
          (product.product_name && product.product_name.trim().length > 0) ||
          (product.product_name_en &&
            product.product_name_en.trim().length > 0),
      );

    const ingredients: IngredientFinderResult[] = filteredProducts.map(
      (product: OpenFoodFactProduct) => {
        const ingredient = {
          name:
            product.product_name ||
            product.product_name_en ||
            'Ingrediente desconocido',

          nutritionalInfoPer100g: {
            calories: product?.nutriments?.['energy-kcal_100g'] || 0,
            protein: product?.nutriments?.['proteins_100g'] || 0,
          },

          imageUrl: product.image_thumb_url || product.image_front_url,
        };

        const externalRef = {
          externalId: product._id,
          source: 'openfoodfacts',
        };

        return {
          ingredient,
          externalRef,
        };
      },
    );

    return ingredients || [];
  }
}
