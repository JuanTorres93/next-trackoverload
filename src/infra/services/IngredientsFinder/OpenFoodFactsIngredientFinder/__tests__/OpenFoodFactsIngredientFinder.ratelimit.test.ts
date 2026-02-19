import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { OpenFoodFactsIngredientFinder } from '../OpenFoodFactsIngredientFinder';

describe('OpenFoodFactsIngredientFinder', () => {
  let ingredientFinder: OpenFoodFactsIngredientFinder;

  beforeAll(() => {
    ingredientFinder = new OpenFoodFactsIngredientFinder();
  });

  describe('Find by name', () => {
    let results: IngredientFinderResult[];

    beforeAll(async () => {
      results = await ingredientFinder.findIngredientsByFuzzyName('Arroz');
    });

    it('returns ingredient and externalRef properties', async () => {
      expect(results.length).toBeGreaterThan(0);

      for (const result of results) {
        expect(result).toHaveProperty('ingredient');
        expect(result).toHaveProperty('externalRef');
      }
    });

    it('ingredient prop has correct properties', async () => {
      const { ingredient } = results[0];

      expect(ingredient).toHaveProperty('name');
      expect(ingredient).toHaveProperty('nutritionalInfoPer100g');
      expect(ingredient).toHaveProperty('imageUrl');
    });

    it('externalRef prop has correct properties', async () => {
      const { externalRef } = results[0];

      expect(externalRef).toHaveProperty('externalId');
      expect(externalRef).toHaveProperty('source');
    });
  });

  describe('Find by barcode', () => {
    let results: IngredientFinderResult[];

    beforeAll(async () => {
      results =
        await ingredientFinder.findIngredientsByBarcode('5056329509972');
    });

    it('returns ingredient and externalRef properties', async () => {
      expect(results.length).toBeGreaterThan(0);

      for (const result of results) {
        expect(result).toHaveProperty('ingredient');
        expect(result).toHaveProperty('externalRef');
      }
    });

    it('ingredient prop has correct properties', async () => {
      const { ingredient } = results[0];

      expect(ingredient).toHaveProperty('name');
      expect(ingredient).toHaveProperty('nutritionalInfoPer100g');
      expect(ingredient).toHaveProperty('imageUrl');
    });

    it('externalRef prop has correct properties', async () => {
      const { externalRef } = results[0];

      expect(externalRef).toHaveProperty('externalId');
      expect(externalRef).toHaveProperty('source');
    });
  });
});
