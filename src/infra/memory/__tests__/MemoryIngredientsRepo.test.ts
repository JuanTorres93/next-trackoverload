import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryIngredientsRepo } from '../MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import * as vp from '@/../tests/createProps';

describe('MemoryIngredientsRepo', () => {
  let repo: MemoryIngredientsRepo;
  let ingredient: Ingredient;

  beforeEach(async () => {
    repo = new MemoryIngredientsRepo();
    ingredient = Ingredient.create(vp.validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  it('should save an ingredient', async () => {
    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: '2',
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
      ...vp.validIngredientProps,
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
      vp.validIngredientProps.id
    );
    expect(fetchedIngredient).not.toBeNull();
    expect(fetchedIngredient?.name).toBe(vp.validIngredientProps.name);
  });

  it('should return null for non-existent ingredient ID', async () => {
    const fetchedIngredient = await repo.getIngredientById('non-existent-id');
    expect(fetchedIngredient).toBeNull();
  });

  it('should delete an ingredient by ID', async () => {
    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);

    await repo.deleteIngredient(vp.validIngredientProps.id);

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });

  describe('getByFuzzyName', () => {
    beforeEach(async () => {
      // Clear repo and add multiple ingredients for search testing
      repo = new MemoryIngredientsRepo();

      const ingredients = [
        Ingredient.create({
          ...vp.validIngredientProps,
          id: '1',
          name: 'Chicken Breast',
        }),
        Ingredient.create({
          ...vp.validIngredientProps,
          id: '2',
          name: 'Brown Rice',
        }),
        Ingredient.create({
          ...vp.validIngredientProps,
          id: '3',
          name: 'Broccoli',
        }),
        Ingredient.create({
          ...vp.validIngredientProps,
          id: '4',
          name: 'Salmon',
        }),
        Ingredient.create({
          ...vp.validIngredientProps,
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
