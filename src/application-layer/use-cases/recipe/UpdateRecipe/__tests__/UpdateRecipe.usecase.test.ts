import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateRecipeUsecase } from '../UpdateRecipe.usecase';

describe('UpdateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let updateRecipeUsecase: UpdateRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    updateRecipeUsecase = new UpdateRecipeUsecase(recipesRepo);

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

  it('should update recipe name successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      id: testRecipe.id,
      name: 'Updated Grilled Chicken',
      userId: vp.userId,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe('Updated Grilled Chicken');
    expect(result.id).toBe(testRecipe.id);
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      id: 'non-existent-id',
      name: 'Updated Name',
      userId: vp.userId,
    };

    await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid id', async () => {
    const request = {
      id: '',
      userId: vp.userId,
      name: 'Updated Name',
    };

    await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError for invalid name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const invalidNames = ['', '   ', null, 4];
    for (const invalidName of invalidNames) {
      const request = {
        id: testRecipe.id,
        name: invalidName,
      };

      // @ts-expect-error testing invalid inputs
      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should not update when no changes provided', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    const request = {
      userId: vp.userId,
      id: testRecipe.id,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe(testRecipe.name);
    expect(result.updatedAt).toEqual(originalUpdatedAt.toISOString());
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      id: testRecipe.id,
      name: 'Updated Name',
      userId: vp.userId,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, 4, {}, [], undefined, true];
    for (const invalidUserId of invalidUserIds) {
      const request = {
        id: testRecipe.id,
        userId: invalidUserId,
        name: 'Updated Name',
      };

      // @ts-expect-error testing invalid inputs
      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });
});
