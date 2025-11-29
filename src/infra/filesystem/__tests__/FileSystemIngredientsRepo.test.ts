import * as vp from '@/../tests/createProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemIngredientsRepo } from '../FileSystemIngredientsRepo';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemIngredientsRepo', () => {
  let repo: FileSystemIngredientsRepo;
  let ingredient: Ingredient;
  const testDir = './__test_data__/ingredients';

  beforeEach(async () => {
    repo = new FileSystemIngredientsRepo(testDir);
    ingredient = Ingredient.create(vp.validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  it('should save an ingredient', async () => {
    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
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

    // Note: The delete method in FileSystem implementation follows the pattern of Memory repo,
    // which rejects with null when trying to delete (to be caught by use case)
    try {
      await repo.deleteIngredient(vp.validIngredientProps.id);
    } catch (error) {
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

    // Verify file content
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.id).toBe(ingredient.id);
    expect(data.name).toBe(ingredient.name);
    expect(data.calories).toBe(ingredient.nutritionalInfoPer100g.calories);
    expect(data.protein).toBe(ingredient.nutritionalInfoPer100g.protein);
  });

  describe('getByFuzzyName', () => {
    beforeEach(async () => {
      // Clear repo and add multiple ingredients for search testing
      await fs.rm(testDir, { recursive: true, force: true });
      repo = new FileSystemIngredientsRepo(testDir);

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

    it('should handle whitespace in search term', async () => {
      const results = await repo.getByFuzzyName('  chicken  ');

      expect(results).toHaveLength(2);
    });
  });
});
