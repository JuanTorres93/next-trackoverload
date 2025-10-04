import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

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

    const newIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    newIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: newIngredient,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should add ingredient to recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    const request = {
      recipeId: testRecipe.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);
    expect(result.ingredientLines).toContain(newIngredientLine);
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw error for invalid ingredientLine', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      ingredientLine: {} as IngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should update recipe updatedAt timestamp', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      recipeId: testRecipe.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
