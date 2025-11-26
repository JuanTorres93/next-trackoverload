import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/types/Id/Id';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateMealFromRecipeUsecase } from '../CreateMealFromRecipe.usecase';
import { Meal } from '@/domain/entities/meal/Meal';
import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { toMealDTO } from '@/application-layer/dtos/MealDTO';

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

  it('should create meal from recipe with default name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(testRecipe.name);
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
    expect(result.calories).toBe(testRecipe.calories);
    expect(result.protein).toBe(testRecipe.protein);

    const savedMeal = await mealsRepo.getMealById(result.id);

    // @ts-expect-error savedMeal won't be null here
    expect(toMealDTO(savedMeal)).toEqual(result);
  });

  it('should create meal from recipe with custom name', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      mealName: 'My Custom Meal',
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.name).toBe('My Custom Meal');
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      userId: vp.userId,
      recipeId: 'non-existent-id',
    };

    await expect(createMealFromRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      userId: vp.userId,
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
        userId: vp.userId,
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
      ...vp.validIngredientProps,
      id: Id.create('ing2'),
      name: 'Rice',
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: 'line2',
      ingredient: secondIngredient,
    });

    testRecipe.addIngredientLine(secondIngredientLine);
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      userId: vp.userId,
      recipeId: testRecipe.id,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(2);
    expect(result.ingredientLines).toEqual(
      testRecipe.ingredientLines.map(toIngredientLineDTO)
    );
  });

  it('should create new meal with different id than recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result.id).not.toBe(testRecipe.id);
  });

  it('should throw error when userId invalid', async () => {
    const invalidUserIds = ['', null, 123, {}, [], undefined, NaN];

    await recipesRepo.saveRecipe(testRecipe);

    for (const userId of invalidUserIds) {
      const request = {
        recipeId: testRecipe.id,
        userId: userId,
      };

      await expect(
        // @ts-expect-error testing invalid types
        createMealFromRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should return MealDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
    };

    const result = await createMealFromRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Meal);
    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.mealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });
});
