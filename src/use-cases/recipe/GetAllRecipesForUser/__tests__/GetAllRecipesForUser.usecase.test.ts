import * as vp from '@/../tests/createProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllRecipesForUserUsecase } from '../GetAllRecipesForUser.usecase';

describe('GetAllRecipesForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getAllRecipesUsecase: GetAllRecipesForUserUsecase;
  let testRecipes: Recipe[];
  const userId1 = 'user-1';
  const userId2 = 'user-2';

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getAllRecipesUsecase = new GetAllRecipesForUserUsecase(recipesRepo);

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
        id: 'recipe-1',
        ingredientLines: [testIngredientLine],
      }),
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        id: 'recipe-2',
        ingredientLines: [testIngredientLine],
      }),
    ];
  });

  it('should return all recipes when they exist', async () => {
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    const result = await getAllRecipesUsecase.execute({ userId: userId1 });

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(testRecipes));
  });

  it('should return empty array when no recipes exist', async () => {
    const result = await getAllRecipesUsecase.execute({ userId: userId1 });

    expect(result).toEqual([]);
  });

  it('should return only recipes for the specified user', async () => {
    // Create recipes for user1
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    // Create a recipe for user2
    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    const user2Recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'user-2-recipe',
      userId: userId2,
      ingredientLines: [testIngredientLine],
    });

    await recipesRepo.saveRecipe(user2Recipe);

    // Get recipes for user1
    const user1Recipes = await getAllRecipesUsecase.execute({
      userId: userId1,
    });
    expect(user1Recipes).toHaveLength(2);
    expect(user1Recipes.every((r) => r.userId === userId1)).toBe(true);

    // Get recipes for user2
    const user2Recipes = await getAllRecipesUsecase.execute({
      userId: userId2,
    });
    expect(user2Recipes).toHaveLength(1);
    expect(user2Recipes[0].userId).toBe(userId2);
  });

  it('should throw an error if userId is not valid', async () => {
    const invalidUserIds = [
      null,
      123,
      '',
      {},
      [],
      undefined,
      '   ',
      NaN,
      false,
      true,
    ];

    for (const invalidUserId of invalidUserIds) {
      const request = { userId: invalidUserId as unknown as string };

      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow();
    }
  });

  it('should throw error for invalid userId', async () => {
    const invalidUserIds = [
      null,
      123,
      '',
      {},
      [],
      undefined,
      '   ',
      NaN,
      false,
      true,
    ];

    for (const invalidUserId of invalidUserIds) {
      const request = { userId: invalidUserId };

      // @ts-expect-error testing invalid types
      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow();
    }
  });
});
