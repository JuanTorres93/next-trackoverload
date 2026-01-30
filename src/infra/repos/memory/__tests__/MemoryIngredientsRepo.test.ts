import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryIngredientsRepo } from '../MemoryIngredientsRepo';

describe('MemoryIngredientsRepo', () => {
  let repo: MemoryIngredientsRepo;
  let ingredient: Ingredient;

  beforeEach(async () => {
    repo = new MemoryIngredientsRepo();
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  it('should save an ingredient', async () => {
    const newIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      id: 'other-id',
      name: 'Rice',
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveIngredient(newIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(2);
    expect(allIngredients[1].name).toBe('Rice');
  });

  it('should update an existing ingredient', async () => {
    const updatedIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      name: 'Updated Chicken Breast',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveIngredient(updatedIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);
    expect(allIngredients[0].name).toBe('Updated Chicken Breast');
  });

  it('should retrieve an ingredient by ID', async () => {
    const fetchedIngredient = await repo.getIngredientById(
      ingredientTestProps.validIngredientProps.id,
    );
    expect(fetchedIngredient).not.toBeNull();
    expect(fetchedIngredient?.name).toBe(
      ingredientTestProps.validIngredientProps.name,
    );
  });

  it('should return null for non-existent ingredient ID', async () => {
    const fetchedIngredient = await repo.getIngredientById('non-existent-id');
    expect(fetchedIngredient).toBeNull();
  });

  describe('getIngredientsByIds', () => {
    beforeEach(async () => {
      repo = new MemoryIngredientsRepo();

      const ingredients = [
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'id-1',
          name: 'Ingredient 1',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'id-2',
          name: 'Ingredient 2',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'id-3',
          name: 'Ingredient 3',
        }),
      ];

      for (const ingredient of ingredients) {
        await repo.saveIngredient(ingredient);
      }
    });

    it('should retrieve multiple ingredients by their IDs', async () => {
      const ingredients = await repo.getIngredientsByIds(['id-1', 'id-3']);

      expect(ingredients).toHaveLength(2);
      expect(ingredients.map((i) => i.id)).toContain('id-1');
      expect(ingredients.map((i) => i.id)).toContain('id-3');
    });

    it('should retrieve single ingredient when only one ID is provided', async () => {
      const ingredients = await repo.getIngredientsByIds(['id-2']);

      expect(ingredients).toHaveLength(1);
      expect(ingredients[0].id).toBe('id-2');
      expect(ingredients[0].name).toBe('Ingredient 2');
    });

    it('should return empty array when provided IDs do not exist', async () => {
      const ingredients = await repo.getIngredientsByIds([
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(ingredients).toHaveLength(0);
    });

    it('should return empty array when provided with empty array', async () => {
      const ingredients = await repo.getIngredientsByIds([]);

      expect(ingredients).toHaveLength(0);
    });

    it('should filter out non-existent IDs and return only existing ones', async () => {
      const ingredients = await repo.getIngredientsByIds([
        'id-1',
        'non-existent',
        'id-2',
      ]);

      expect(ingredients).toHaveLength(2);
      expect(ingredients.map((i) => i.id)).toContain('id-1');
      expect(ingredients.map((i) => i.id)).toContain('id-2');
    });

    it('should retrieve all ingredients when all IDs are provided', async () => {
      const ingredients = await repo.getIngredientsByIds([
        'id-1',
        'id-2',
        'id-3',
      ]);

      expect(ingredients).toHaveLength(3);
    });
  });

  it('should delete an ingredient by ID', async () => {
    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);

    await repo.deleteIngredient(ingredientTestProps.validIngredientProps.id);

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });

  describe('getByFuzzyName', () => {
    beforeEach(async () => {
      // Clear repo and add multiple ingredients for search testing
      repo = new MemoryIngredientsRepo();

      const ingredients = [
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: '1',
          name: 'Chicken Breast',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: '2',
          name: 'Brown Rice',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: '3',
          name: 'Broccoli',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: '4',
          name: 'Salmon',
        }),
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: '5',
          name: 'Chicken Thigh',
        }),
      ];

      for (const ingredient of ingredients) {
        await repo.saveIngredient(ingredient);
      }
    });

    it('should find ingredients by exact name match', async () => {
      const results = await repo.getByFuzzyName('Chicken Breast');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Chicken Breast');
    });

    it('should find ingredients by partial name match (case insensitive)', async () => {
      const results = await repo.getByFuzzyName('chicken');

      expect(results).toHaveLength(2);
      expect(results.map((r) => r.name)).toContain('Chicken Breast');
      expect(results.map((r) => r.name)).toContain('Chicken Thigh');
    });

    it('should find ingredients by partial name match (different case)', async () => {
      const results = await repo.getByFuzzyName('BROWN');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Brown Rice');
    });

    it('should find ingredients by substring match', async () => {
      const results = await repo.getByFuzzyName('rice');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Brown Rice');
    });

    it('should find ingredients with mixed case search term', async () => {
      const results = await repo.getByFuzzyName('BrOcCoLi');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Broccoli');
    });

    it('should return empty array for non-matching search term', async () => {
      const results = await repo.getByFuzzyName('pizza');

      expect(results).toHaveLength(0);
    });

    it('should return empty array for empty search term', async () => {
      const results = await repo.getByFuzzyName('');

      expect(results).toHaveLength(0);
    });

    it('should return empty array for whitespace-only search term', async () => {
      const results = await repo.getByFuzzyName('   ');

      expect(results).toHaveLength(0);
    });

    it('should handle search term with leading/trailing whitespace', async () => {
      const results = await repo.getByFuzzyName('  salmon  ');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Salmon');
    });

    it('should find multiple ingredients when search term matches multiple names', async () => {
      const results = await repo.getByFuzzyName('o'); // should match Brown Rice, Broccoli, Salmon

      expect(results.length).toBeGreaterThanOrEqual(3);
      const names = results.map((r) => r.name);
      expect(names).toContain('Brown Rice');
      expect(names).toContain('Broccoli');
      expect(names).toContain('Salmon');
    });
  });
});
