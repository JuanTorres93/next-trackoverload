import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { InfrastructureError } from '@/domain/common/errors';
import { IngredientFinder } from '@/domain/services/IngredientFinder.port';

// DOCS: https://openfoodfacts.github.io/openfoodfacts-server/api/
const READ_RATE_LIMITS = {
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
    'OpenFoodFactsIngredientFinder: Missing Authorization header configuration.'
  );
}

export class OpenFoodFactsIngredientFinder implements IngredientFinder {
  async findIngredientsByFuzzyName() {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=banania&search_simple=1&action=process&json=1`,
      {
        method: 'GET',
        headers: { ...authHeader! },
      }
    );
    const json = await response.json();

    const keys = Object.keys(json);

    // TODO DELETE THESE DEBUG LOGS
    console.log('keys');
    console.log(keys);

    // TODO DELETE THESE DEBUG LOGS
    console.log('json');
    console.log(json[keys[0]]);

    // TODO DELETE THESE DEBUG LOGS
    console.log('Object(json)');
    console.log(Object.keys(json).length);
    return [];
  }

  async findIngredientsByBarcode() {
    return [];
  }
}

const testClass = new OpenFoodFactsIngredientFinder();
testClass.findIngredientsByFuzzyName();
