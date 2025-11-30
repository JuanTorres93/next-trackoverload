import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateMealFromRecipeUsecase } from '../CreateMealFromRecipe.usecase';

describe('CreateMealFromRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let createMealFromRecipeUsecase: CreateMealFromRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    createMealFromRecipeUsecase = new CreateMealFromRecipeUsecase(
      recipesRepo,
      mealsRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
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

  it('should preserve all ingredient lines from recipe', async () => {
    const secondIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'ing2',
      name: 'Rice',
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
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

  it('should throw error if user does not exist', async () => {
    await expect(
      createMealFromRecipeUsecase.execute({
        recipeId: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);
    await expect(
      createMealFromRecipeUsecase.execute({
        recipeId: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(/CreateMealFromRecipeUsecase.*user.*not.*found/);
  });
});
