import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateRecipeUsecase } from '../UpdateRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('UpdateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let updateRecipeUsecase: UpdateRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    updateRecipeUsecase = new UpdateRecipeUsecase(recipesRepo);

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

  it('should update recipe name successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1));

    const request = {
      id: testRecipe.id,
      name: 'Updated Grilled Chicken',
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe('Updated Grilled Chicken');
    expect(result.id).toBe(testRecipe.id);
    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      id: 'non-existent-id',
      name: 'Updated Name',
    };

    await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid id', async () => {
    const request = {
      id: '',
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
      id: testRecipe.id,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe(testRecipe.name);
    expect(result.updatedAt).toEqual(originalUpdatedAt);
  });
});
