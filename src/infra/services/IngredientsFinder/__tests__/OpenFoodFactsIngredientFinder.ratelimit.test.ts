import { IngredientFinderDTO } from '@/domain/services/IngredientFinder.port';
import { OpenFoodFactsIngredientFinder } from '../OpenFoodFactsIngredientFinder';

describe('OpenFoodFactsIngredientFinder', () => {
  let ingredientFinder: OpenFoodFactsIngredientFinder;

  beforeAll(() => {
    ingredientFinder = new OpenFoodFactsIngredientFinder();
  });

  describe('Find by name', () => {
    it('returns ingredient info', async () => {
      const results: IngredientFinderDTO[] =
        await ingredientFinder.findIngredientsByFuzzyName('Arroz');

      expect(results.length).toBeGreaterThan(0);

      for (const ingredient of results) {
        expect(ingredient).toHaveProperty('externalId');
        expect(ingredient).toHaveProperty('source');
        expect(ingredient).toHaveProperty('name');
        expect(ingredient).toHaveProperty('nutritionalInfoPer100g');
        expect(ingredient).toHaveProperty('imageUrl');

        expect(ingredient.source).toBe('openfoodfacts');

        expect(ingredient.nutritionalInfoPer100g).toHaveProperty('calories');
        expect(ingredient.nutritionalInfoPer100g).toHaveProperty('protein');
      }
    });
  });

  // TODO test search by barcode when implemented
});
