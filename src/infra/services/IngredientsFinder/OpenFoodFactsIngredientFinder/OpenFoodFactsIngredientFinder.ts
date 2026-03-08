import { InfrastructureError } from '@/domain/common/errors';
import {
  IngredientFinder,
  IngredientFinderResult,
} from '@/domain/services/IngredientFinder.port';
import { RateLimiter } from '@/domain/services/RateLimiter.port';

// DOCS: https://openfoodfacts.github.io/openfoodfacts-server/api/
// SEARCH DOCS: https://search.openfoodfacts.org/docs
export const READ_RATE_LIMITS = {
  // GET /api/v*/product
  productQueries: {
    requests: 100,
    perMinutes: 1,
  },
  // GET https://search.openfoodfacts.org/search (// The 10 req/min limit in the official docs only applies to legacy /cgi/search.pl and /api/v*/search.
  // We keep a conservative limit here as good practice.
  searchQueries: {
    requests: 25, // 10
    perMinutes: 1,
  },
  // such as /categories, /label/organic, /ingredient/salt, /category/breads,...
  facetQueries: {
    requests: 2,
    perMinutes: 1,
  },
};

// Used for product lookups (barcode)
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://world.openfoodfacts.org'
    : 'https://world.openfoodfacts.net';

// Dedicated Elasticsearch-based search service — much faster than legacy BASE_URL/cgi/search.pl
const SEARCH_URL = 'https://search.openfoodfacts.org/search';

const IMAGES_BASE_URL = 'https://images.openfoodfacts.org/images/products';

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

const fields =
  'code,product_name,product_name_en,nutriments,image_thumb_url,image_front_url,images';

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

    const url = `${SEARCH_URL}?q=${encodeURIComponent(name)}&page_size=24&fields=${fields}`;

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

    return this.mapOpenFoodFactProductToIngredientResult(json.hits || []);
  }

  async findIngredientsByBarcode(barcode: string) {
    if (await this.barcodeRateLimiter.isRateLimited(this.clientId)) {
      // TODO throw RateLimitError instead
      throw new InfrastructureError(
        'OpenFoodFactsIngredientFinder: Rate limit exceeded for barcode queries',
      );
    }

    const url = `${BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}?fields=${fields}`;

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

          imageUrl:
            product.image_thumb_url ||
            product.image_front_url ||
            computeImageUrlFromArray(product.code, product.images),
        };

        const externalRef = {
          externalId: product.code,
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

type OpenFoodFactImageSizes = {
  [size: string]: { w: number; h: number };
};

type OpenFoodFactNamedImage = {
  imgid: string;
  sizes: OpenFoodFactImageSizes;
};

type OpenFoodFactRawImage = {
  sizes: OpenFoodFactImageSizes;
  uploaded_t?: number | string;
  uploader?: string;
};

type OpenFoodFactImages = {
  [key: string]: OpenFoodFactNamedImage | OpenFoodFactRawImage;
};

type OpenFoodFactProduct = {
  code: string;
  product_name: string;
  product_name_en?: string;
  nutriments: {
    'energy-kcal_100g': number;
    proteins_100g: number;
  };
  image_thumb_url?: string;
  image_front_url?: string;
  images?: OpenFoodFactImages;
};

function isNamedImage(
  image: OpenFoodFactNamedImage | OpenFoodFactRawImage,
): image is OpenFoodFactNamedImage {
  return (
    'imgid' in image &&
    typeof (image as OpenFoodFactNamedImage).imgid === 'string'
  );
}

// Splits barcode into path segments used by the OpenFoodFacts image CDN.
// e.g. '3017620422003' → '301/762/042/2003'
function formatBarcodeForImagePath(barcode: string): string {
  if (barcode.length >= 9) {
    const parts = [
      barcode.slice(0, 3),
      barcode.slice(3, 6),
      barcode.slice(6, 9),
    ];
    const rest = barcode.slice(9);
    if (rest) parts.push(rest);
    return parts.join('/');
  }
  return barcode;
}

function computeImageUrlFromArray(
  barcode: string,
  images?: OpenFoodFactImages,
): string | undefined {
  if (!images || !barcode) return undefined;

  const barcodePath = formatBarcodeForImagePath(barcode);
  const keys = Object.keys(images);

  // Prefer front image (any language), then any other named image
  const namedKey =
    keys.find((k) => k.startsWith('front_')) ??
    keys.find((k) => !/^\d+$/.test(k) && isNamedImage(images[k]));

  if (namedKey && isNamedImage(images[namedKey])) {
    const { imgid } = images[namedKey] as OpenFoodFactNamedImage;
    return `${IMAGES_BASE_URL}/${barcodePath}/${imgid}.400.jpg`;
  }

  // Fall back to first raw numeric image
  const numericKey = keys.find((k) => /^\d+$/.test(k));
  if (numericKey) {
    return `${IMAGES_BASE_URL}/${barcodePath}/${numericKey}.400.jpg`;
  }

  return undefined;
}
