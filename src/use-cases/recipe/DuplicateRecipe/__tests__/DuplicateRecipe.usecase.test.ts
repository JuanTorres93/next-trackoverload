import { beforeEach, describe, expect, it } from 'vitest';
import { DuplicateRecipeUsecase } from '../DuplicateRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('DuplicateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let duplicateRecipeUsecase: DuplicateRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    duplicateRecipeUsecase = new DuplicateRecipeUsecase(recipesRepo);

    const testIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const testIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testRecipe = Recipe.create({
      id: uuidv4(),
      name: 'Grilled Chicken',
      ingredientLines: [testIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should duplicate recipe with default name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result).toHaveProperty('id');
    expect(result.id).not.toBe(testRecipe.id);
    expect(result.name).toBe(`${testRecipe.name} (Copy)`);
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
    expect(result.calories).toBe(testRecipe.calories);
    expect(result.protein).toBe(testRecipe.protein);

    const savedRecipe = await recipesRepo.getRecipeById(result.id);
    expect(savedRecipe).toEqual(result);
  });

  it('should duplicate recipe with custom name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      newName: 'My Custom Recipe Copy',
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result.name).toBe('My Custom Recipe Copy');
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
    };

    await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
    };

    await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should preserve all ingredient lines from original recipe', async () => {
    const secondIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const secondIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: secondIngredient,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testRecipe.addIngredientLine(secondIngredientLine);
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(2);
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
  });

  it('should create independent copy that can be modified', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const duplicatedRecipe = await duplicateRecipeUsecase.execute(request);

    // Modify the duplicated recipe
    duplicatedRecipe.rename('Modified Copy');

    // Original recipe should be unchanged
    const originalRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(originalRecipe?.name).toBe(testRecipe.name);
    expect(duplicatedRecipe.name).toBe('Modified Copy');
  });

  it('should have different creation timestamps', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1));

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result.createdAt.getTime()).toBeGreaterThan(
      testRecipe.createdAt.getTime()
    );
    expect(result.updatedAt.getTime()).toBeGreaterThan(
      testRecipe.updatedAt.getTime()
    );
  });
});
