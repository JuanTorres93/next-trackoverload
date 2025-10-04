import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipesByIdsUsecase } from '../GetRecipesByIds.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('GetRecipesByIdsUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getRecipesByIdsUsecase: GetRecipesByIdsUsecase;
  let testRecipes: Recipe[];

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getRecipesByIdsUsecase = new GetRecipesByIdsUsecase(recipesRepo);

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

    testRecipes = [
      Recipe.create({
        id: uuidv4(),
        name: 'Grilled Chicken',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Recipe.create({
        id: uuidv4(),
        name: 'Chicken Salad',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  });

  it('should return recipes for valid ids', async () => {
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    const request = {
      ids: [testRecipes[0].id, testRecipes[1].id],
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(testRecipes));
  });

  it('should filter out non-existent recipes', async () => {
    await recipesRepo.saveRecipe(testRecipes[0]);

    const request = {
      ids: [testRecipes[0].id, 'non-existent-id'],
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testRecipes[0]);
  });

  it('should return empty array for all non-existent ids', async () => {
    // NOTE: this test will change to throw ValidationError
    const request = {
      ids: ['non-existent-1', 'non-existent-2'],
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toEqual([]);
  });

  it('should throw ValidationError for empty ids array', async () => {
    const request = { ids: [] };

    await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError for invalid id in array', async () => {
    const request = { ids: ['valid-id', ''] };

    await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should handle duplicate ids gracefully', async () => {
    await recipesRepo.saveRecipe(testRecipes[0]);

    const request = {
      ids: [testRecipes[0].id, testRecipes[0].id],
    };

    const result = await getRecipesByIdsUsecase.execute(request);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testRecipes[0]);
  });
});
