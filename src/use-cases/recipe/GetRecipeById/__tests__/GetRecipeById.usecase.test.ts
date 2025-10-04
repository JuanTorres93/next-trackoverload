import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipeByIdUsecase } from '../GetRecipeById.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('GetRecipeByIdUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getRecipeByIdUsecase: GetRecipeByIdUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getRecipeByIdUsecase = new GetRecipeByIdUsecase(recipesRepo);

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

  it('should return recipe when it exists', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = { id: testRecipe.id };
    const result = await getRecipeByIdUsecase.execute(request);

    expect(result).toEqual(testRecipe);
  });

  it('should return null when recipe does not exist', async () => {
    const request = { id: 'non-existent-id' };
    const result = await getRecipeByIdUsecase.execute(request);

    expect(result).toBeNull();
  });

  it('should throw an error if id is not valid', async () => {
    const invalidIds = [null, 123, '', {}, []];

    for (const invalidId of invalidIds) {
      const request = { id: invalidId as unknown as string };

      await expect(getRecipeByIdUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should throw an error if id is null', async () => {
    const request = { id: null as unknown as string };

    await expect(getRecipeByIdUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });
});
