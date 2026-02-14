import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryIngredientsRepo } from '../MemoryIngredientsRepo';

describe('MemoryIngredientsRepo', () => {
  let repo: MemoryIngredientsRepo;
  let ingredient: Ingredient;

  beforeEach(async () => {
    repo = new MemoryIngredientsRepo();
    ingredient = ingredientTestProps.createTestIngredient();

    await repo.saveIngredient(ingredient);
  });

  it('should save an ingredient', async () => {
    const newIngredient = ingredientTestProps.createTestIngredient({
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
    const updatedIngredient = ingredientTestProps.createTestIngredient({
      id: ingredient.id,
      name: 'Updated Chicken Breast',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveIngredient(updatedIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);
    expect(allIngredients[0].name).toBe('Updated Chicken Breast');
  });

  it('should retrieve an ingredient by ID', async () => {
    const fetchedIngredient = await repo.getIngredientById(ingredient.id);
    expect(fetchedIngredient).not.toBeNull();
    expect(fetchedIngredient?.name).toBe(ingredient.name);
  });

  it('should return null for non-existent ingredient ID', async () => {
    const fetchedIngredient = await repo.getIngredientById('non-existent-id');
    expect(fetchedIngredient).toBeNull();
  });

  describe('getIngredientsByIds', () => {
    beforeEach(async () => {
      repo = new MemoryIngredientsRepo();

      const ingredients = [
        ingredientTestProps.createTestIngredient({
          id: 'id-1',
          name: 'Ingredient 1',
        }),
        ingredientTestProps.createTestIngredient({
          id: 'id-2',
          name: 'Ingredient 2',
        }),
        ingredientTestProps.createTestIngredient({
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

    await repo.deleteIngredient(ingredient.id);

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });
});
