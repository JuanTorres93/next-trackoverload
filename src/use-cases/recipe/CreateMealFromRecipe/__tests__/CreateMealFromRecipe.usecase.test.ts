import { beforeEach, describe, expect, it } from 'vitest';
import { CreateMealFromRecipeUsecase } from '../CreateMealFromRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('CreateMealFromRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let mealsRepo: MemoryMealsRepo;
  let createMealFromRecipeUsecase: CreateMealFromRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    mealsRepo = new MemoryMealsRepo();
    createMealFromRecipeUsecase = new CreateMealFromRecipeUsecase(
      recipesRepo,
      mealsRepo
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
  });

  it('should create meal from recipe with default name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(testRecipe.name);
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
    expect(result.calories).toBe(testRecipe.calories);
    expect(result.protein).toBe(testRecipe.protein);

    const savedMeal = await mealsRepo.getMealById(result.id);
    expect(savedMeal).toEqual(result);
  });

  it('should create meal from recipe with custom name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      mealName: 'My Custom Meal',
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.name).toBe('My Custom Meal');
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
    };

    await expect(createMealFromRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
    };

    await expect(createMealFromRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError for invalid mealName', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const invalidNames = [null, 123, {}, []];

    for (const name of invalidNames) {
      const request = {
        recipeId: testRecipe.id,
        mealName: name,
      };

      await expect(
        // @ts-expect-error testing invalid types
        createMealFromRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should preserve all ingredient lines from recipe', async () => {
    const secondIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
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

    testRecipe.addIngredientLine(secondIngredientLine);
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(2);
    expect(result.ingredientLines).toEqual(testRecipe.ingredientLines);
  });

  it('should create new meal with different id than recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.id).not.toBe(testRecipe.id);
  });
});
