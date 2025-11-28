import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Id } from '@/domain/value-objects/Id/Id';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DuplicateRecipeUsecase } from '../DuplicateRecipe.usecase';
import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';

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
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
    expect(result.calories).toBe(testRecipe.calories);
    expect(result.protein).toBe(testRecipe.protein);

    const savedRecipe = await recipesRepo.getRecipeById(result.id);
    // @ts-expect-error savedRecipe won't be null here
    expect(toRecipeDTO(savedRecipe)).toEqual(result);
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
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
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
      id: Id.create('second-ingredient-id'),
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: Id.create('second-ingredient-line-id'),
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
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
  });

  it('should create independent copy with different id', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
    };

    const duplicatedRecipe = await duplicateRecipeUsecase.execute(request);

    // Duplicated recipe should have different id but same content
    expect(duplicatedRecipe.id).not.toBe(testRecipe.id);
    expect(duplicatedRecipe.name).toBe(`${testRecipe.name} (Copy)`);
    expect(duplicatedRecipe.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );

    // Original recipe should be unchanged in the repo
    const originalRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(originalRecipe).toBeDefined();
    expect(originalRecipe!.name).toBe(testRecipe.name);
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

    expect(new Date(result.createdAt).getTime()).toBeGreaterThan(
      testRecipe.createdAt.getTime()
    );
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
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

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
    };

    const result = await duplicateRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });
});
