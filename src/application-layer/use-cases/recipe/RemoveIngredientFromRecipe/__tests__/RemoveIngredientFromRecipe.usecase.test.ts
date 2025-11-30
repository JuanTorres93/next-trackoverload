import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveIngredientFromRecipeUsecase } from '../RemoveIngredientFromRecipe.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('RemoveIngredientFromRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let removeIngredientFromRecipeUsecase: RemoveIngredientFromRecipeUsecase;
  let testRecipe: Recipe;
  let testIngredient: Ingredient;
  let secondIngredient: Ingredient;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    removeIngredientFromRecipeUsecase = new RemoveIngredientFromRecipeUsecase(
      recipesRepo
    );

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
    });

    secondIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'ingredient-2',
    });

    const firstIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      id: 'ingredient-line-2',
      ingredient: secondIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [firstIngredientLine, secondIngredientLine],
    });
  });

  it('should remove ingredient from recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    const request = {
      recipeId: testRecipe.id,
      ingredientId: testIngredient.id,
      userId: vp.userId,
    };

    const result = await removeIngredientFromRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount - 1);
    expect(
      result.ingredientLines.some(
        (line) => line.ingredient.id === testIngredient.id
      )
    ).toBe(false);
    expect(
      result.ingredientLines.some(
        (line) => line.ingredient.id === secondIngredient.id
      )
    ).toBe(true);
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      ingredientId: testIngredient.id,
      userId: vp.userId,
    };

    const result = await removeIngredientFromRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      ingredientId: testIngredient.id,
      userId: vp.userId,
    };

    await expect(
      removeIngredientFromRecipeUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when ingredient not found in recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      userId: vp.userId,
      recipeId: testRecipe.id,
      ingredientId: 'non-existent-ingredient-id',
    };

    await expect(
      removeIngredientFromRecipeUsecase.execute(request)
    ).rejects.toThrow();
  });

  it('should update recipe updatedAt timestamp', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      recipeId: testRecipe.id,
      ingredientId: testIngredient.id,
      userId: vp.userId,
    };

    const result = await removeIngredientFromRecipeUsecase.execute(request);

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
