import { beforeEach, describe, expect, it, afterEach } from 'vitest';
import { FileSystemIngredientLinesRepo } from '../FileSystemIngredientLinesRepo';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/value-objects/Id/Id';
import * as vp from '@/../tests/createProps';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('FileSystemIngredientLinesRepo', () => {
  let repo: FileSystemIngredientLinesRepo;
  let testIngredient: Ingredient;
  const testDataDir = join(process.cwd(), 'data');
  const testFilePath = join(testDataDir, 'ingredient-lines.json');

  beforeEach(async () => {
    repo = new FileSystemIngredientLinesRepo();

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Test Ingredient',
      nutritionalInfoPer100g: {
        calories: 100,
        protein: 20,
      },
    });

    // Create a backup of the original file if it exists
    try {
      const originalData = await fs.readFile(testFilePath, 'utf-8');
      await fs.writeFile(`${testFilePath}.backup`, originalData);
    } catch {
      // File doesn't exist, no backup needed
    }

    // Clear the test file for isolated tests
    await fs.writeFile(testFilePath, '[]');
  });

  afterEach(async () => {
    // Restore the original file
    try {
      const backupData = await fs.readFile(`${testFilePath}.backup`, 'utf-8');
      await fs.writeFile(testFilePath, backupData);
      await fs.unlink(`${testFilePath}.backup`);
    } catch {
      // No backup exists, remove test file
      try {
        await fs.unlink(testFilePath);
      } catch {
        // File doesn't exist
      }
    }
  });

  it('should save multiple ingredient lines without race conditions', async () => {
    const ingredientLines = Array.from({ length: 5 }, (_, i) =>
      IngredientLine.create({
        id: Id.create(`line-${i}`),
        ingredient: testIngredient,
        quantityInGrams: 100 + i * 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    // Save multiple ingredient lines at once
    await repo.saveMultipleIngredientLines(ingredientLines);

    // Verify all were saved
    const allLines = await repo.getAllIngredientLines();
    expect(allLines).toHaveLength(5);

    // Verify each line exists and has correct data
    for (let i = 0; i < 5; i++) {
      const savedLine = await repo.getIngredientLineById(`line-${i}`);
      expect(savedLine).not.toBeNull();
      expect(savedLine?.quantityInGrams).toBe(100 + i * 10);
    }
  });

  it('should update existing ingredient lines when saving multiple', async () => {
    // First, save some initial lines
    const initialLines = Array.from({ length: 3 }, (_, i) =>
      IngredientLine.create({
        id: Id.create(`line-${i}`),
        ingredient: testIngredient,
        quantityInGrams: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    await repo.saveMultipleIngredientLines(initialLines);

    // Then update them with new quantities
    const updatedLines = Array.from({ length: 3 }, (_, i) =>
      IngredientLine.create({
        id: Id.create(`line-${i}`),
        ingredient: testIngredient,
        quantityInGrams: 200, // Updated quantity
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    await repo.saveMultipleIngredientLines(updatedLines);

    // Verify updates
    const allLines = await repo.getAllIngredientLines();
    expect(allLines).toHaveLength(3); // Should still be 3, not 6

    for (let i = 0; i < 3; i++) {
      const savedLine = await repo.getIngredientLineById(`line-${i}`);
      expect(savedLine).not.toBeNull();
      expect(savedLine?.quantityInGrams).toBe(200); // Should be updated value
    }
  });

  it('should preserve ingredient imageUrl when deserializing', async () => {
    // Create ingredient with imageUrl
    const ingredientWithImage = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('ingredient-with-image'),
      name: 'Test Ingredient with Image',
      nutritionalInfoPer100g: {
        calories: 100,
        protein: 20,
      },
      imageUrl: 'https://example.com/test-image.jpg',
    });

    const ingredientLine = IngredientLine.create({
      id: Id.create('line-with-image'),
      ingredient: ingredientWithImage,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the ingredient line
    await repo.saveIngredientLine(ingredientLine);

    // Retrieve the ingredient line (this triggers deserialization)
    const retrievedLine = await repo.getIngredientLineById('line-with-image');

    // Verify the imageUrl is preserved
    expect(retrievedLine).not.toBeNull();
    expect(retrievedLine?.ingredient.imageUrl).toBe(
      'https://example.com/test-image.jpg'
    );
    expect(retrievedLine?.ingredient.name).toBe('Test Ingredient with Image');
    expect(retrievedLine?.quantityInGrams).toBe(150);
  });
});
