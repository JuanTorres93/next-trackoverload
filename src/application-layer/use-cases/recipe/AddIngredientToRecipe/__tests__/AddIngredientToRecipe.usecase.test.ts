import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';

describe('AddIngredientToRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let addIngredientToRecipeUsecase: AddIngredientToRecipeUsecase;
  let testRecipe: Recipe;
  let newIngredientLine: IngredientLine;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    addIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
      recipesRepo
    );

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

    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    newIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: newIngredient,
    });
  });

  it('should add ingredient to recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

    const ingredientLineIds = result.ingredientLines.map((line) => line.id);

    expect(ingredientLineIds).toContain(newIngredientLine.id);
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw error for invalid ingredientLine', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const invalidIngredientLines = [null, {}, { id: '123' }, []];

    for (const invalidLine of invalidIngredientLines) {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
        ingredientLine: invalidLine,
      };

      await expect(
        // @ts-expect-error testing invalid inputs
        addIngredientToRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should update recipe updatedAt timestamp', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      userId: vp.userId,
      recipeId: testRecipe.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = [null, '', '   ', 123, {}, []];

    for (const invalidUserId of invalidUserIds) {
      const request = {
        recipeId: testRecipe.id,
        userId: invalidUserId,
        ingredientLine: newIngredientLine,
      };

      await expect(
        // @ts-expect-error testing invalid inputs
        addIngredientToRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });
});
