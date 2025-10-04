import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveIngredientFromRecipeUsecase } from '../RemoveIngredientFromRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

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
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    secondIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const firstIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const secondIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: secondIngredient,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testRecipe = Recipe.create({
      id: uuidv4(),
      name: 'Chicken with Rice',
      ingredientLines: [firstIngredientLine, secondIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should remove ingredient from recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    const request = {
      recipeId: testRecipe.id,
      ingredientId: testIngredient.id,
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

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      ingredientId: testIngredient.id,
    };

    await expect(
      removeIngredientFromRecipeUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      ingredientId: testIngredient.id,
    };

    await expect(
      removeIngredientFromRecipeUsecase.execute(request)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid ingredientId', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      ingredientId: '',
    };

    await expect(
      removeIngredientFromRecipeUsecase.execute(request)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when ingredient not found in recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
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
    };

    const result = await removeIngredientFromRecipeUsecase.execute(request);

    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
