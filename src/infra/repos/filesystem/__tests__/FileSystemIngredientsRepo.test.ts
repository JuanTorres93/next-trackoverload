import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import fs from 'fs/promises';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemIngredientsRepo } from '../FileSystemIngredientsRepo';

describe('FileSystemIngredientsRepo', () => {
  let repo: FileSystemIngredientsRepo;
  let ingredient: Ingredient;
  const testDir = './__test_data__/ingredients';

  beforeEach(async () => {
    repo = new FileSystemIngredientsRepo(testDir);
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
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

    const savedIngredient = allIngredients.find((i) => i.id === 'other-id');
    expect(savedIngredient).toBeDefined();
    expect(savedIngredient?.name).toBe('Rice');
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
      await fs.rm(testDir, { recursive: true, force: true });
      repo = new FileSystemIngredientsRepo(testDir);

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

    // Note: The delete method in FileSystem implementation follows the pattern of Memory repo,
    // which rejects with null when trying to delete (to be caught by use case)
    try {
      await repo.deleteIngredient(ingredientTestProps.validIngredientProps.id);
    } catch {
      // Expected to throw/reject
    }

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });

  it('should persist data to filesystem', async () => {
    // Verify file exists
    const filePath = path.join(testDir, `${ingredient.id}.json`);
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);

    // Verify file content (DTO structure)
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.id).toBe(ingredient.id);
    expect(data.name).toBe(ingredient.name);
    expect(data.nutritionalInfoPer100g.calories).toBe(
      ingredient.nutritionalInfoPer100g.calories,
    );
    expect(data.nutritionalInfoPer100g.protein).toBe(
      ingredient.nutritionalInfoPer100g.protein,
    );
  });
});
