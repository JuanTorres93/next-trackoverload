import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteRecipeUsecase } from '../DeleteRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('DeleteRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let deleteRecipeUsecase: DeleteRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    deleteRecipeUsecase = new DeleteRecipeUsecase(recipesRepo);

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

  it('should delete recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = { id: testRecipe.id };
    await deleteRecipeUsecase.execute(request);

    const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(deletedRecipe).toBeNull();
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = { id: 'non-existent-id' };

    await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid id', async () => {
    const request = { id: '' };

    await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should not affect other recipes when deleting one', async () => {
    const secondRecipe = Recipe.create({
      id: uuidv4(),
      name: 'Chicken Salad',
      ingredientLines: testRecipe.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await recipesRepo.saveRecipe(testRecipe);
    await recipesRepo.saveRecipe(secondRecipe);

    const request = { id: testRecipe.id };
    await deleteRecipeUsecase.execute(request);

    const remainingRecipe = await recipesRepo.getRecipeById(secondRecipe.id);
    expect(remainingRecipe).toEqual(secondRecipe);

    const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(deletedRecipe).toBeNull();
  });
});
