import * as vp from '@/../tests/createProps';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DuplicateRecipeUsecase } from '../DuplicateRecipe.usecase';

describe('DuplicateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let duplicateRecipeUsecase: DuplicateRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    duplicateRecipeUsecase = new DuplicateRecipeUsecase(recipesRepo);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
  });

  it('should duplicate recipe with default name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
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
      userId: vp.userId,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result.name).toBe('My Custom Recipe Copy');
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      userId: vp.userId,
    };

    await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      userId: vp.userId,
    };

    await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should preserve all ingredient lines from original recipe', async () => {
    const secondIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'second-ingredient-id',
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: 'second-ingredient-line-id',
      ingredient: secondIngredient,
    });

    testRecipe.addIngredientLine(secondIngredientLine);
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      userId: vp.userId,
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
      userId: vp.userId,
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
      userId: vp.userId,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result.createdAt.getTime()).toBeGreaterThan(
      testRecipe.createdAt.getTime()
    );
    expect(result.updatedAt.getTime()).toBeGreaterThan(
      testRecipe.updatedAt.getTime()
    );
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, 123, {}, []];

    for (const userId of invalidUserIds) {
      const request = {
        recipeId: testRecipe.id,
        userId: userId,
      };

      // @ts-expect-error testing invalid inputs
      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });
});
