import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipesByIdsForUserUsecase } from '../GetRecipesByIdsForUser.usecase';
import { Id } from '@/domain/types/Id/Id';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';

describe('GetRecipesByIdsForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getRecipesByIdsUsecase: GetRecipesByIdsForUserUsecase;
  let testRecipes: Recipe[];

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getRecipesByIdsUsecase = new GetRecipesByIdsForUserUsecase(recipesRepo);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipes = [
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        ingredientLines: [testIngredientLine],
      }),
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        id: Id.create('recipe2'),
        ingredientLines: [testIngredientLine],
      }),
    ];
  });

  it('should return recipes for valid ids', async () => {
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    const request = {
      ids: [testRecipes[0].id, testRecipes[1].id],
      userId: vp.userId,
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining(testRecipes.map(toRecipeDTO))
    );
  });

  it('should return an array of RecipeDTOs', async () => {
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    const request = {
      ids: [testRecipes[0].id, testRecipes[1].id],
      userId: vp.userId,
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    for (const recipe of result) {
      expect(recipe).not.toBeInstanceOf(Recipe);

      for (const prop of dto.recipeDTOProperties) {
        expect(recipe).toHaveProperty(prop);
      }
    }
  });

  it('should filter out non-existent recipes', async () => {
    await recipesRepo.saveRecipe(testRecipes[0]);

    const request = {
      ids: [testRecipes[0].id, 'non-existent-id'],
      userId: vp.userId,
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
  });

  it('should return empty array for all non-existent ids', async () => {
    // NOTE: this test will change to throw ValidationError
    const request = {
      ids: ['non-existent-1', 'non-existent-2'],
      userId: vp.userId,
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toEqual([]);
  });

  it('should throw ValidationError for empty ids array', async () => {
    const request = { ids: [], userId: vp.userId };

    await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError for invalid id in array', async () => {
    const request = { ids: ['valid-id', ''], userId: vp.userId };

    await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should handle duplicate ids gracefully', async () => {
    await recipesRepo.saveRecipe(testRecipes[0]);

    const request = {
      ids: [testRecipes[0].id, testRecipes[0].id],
      userId: vp.userId,
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
  });
});
