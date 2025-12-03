import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let recipesRepo: MemoryRecipesRepo;

  let addMealToDayUsecase: AddMealToDayUsecase;

  let day: Day;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let recipe: Recipe;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    recipesRepo = new MemoryRecipesRepo();
    addMealToDayUsecase = new AddMealToDayUsecase(
      daysRepo,
      mealsRepo,
      usersRepo,
      recipesRepo
    );
    day = Day.create({
      ...vp.validDayProps(),
    });
    ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    user = User.create({
      ...vp.validUserProps,
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
    await recipesRepo.saveRecipe(recipe);
  });

  it('should add meal to existing day', async () => {
    const result = await addMealToDayUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result.mealIds).toHaveLength(1);

    expect(result.id).not.toBeUndefined();
    expect(result.id).not.toBe(recipe.id);
    expect(result.id).toBe(day.id);
  });

  it('should create new independent ingredient lines from recipe', async () => {
    const result = await addMealToDayUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    const addedMeal = await mealsRepo.getMealById(result.mealIds[0]);

    expect(addedMeal!.ingredientLines).toHaveLength(
      recipe.ingredientLines.length
    );
    expect(addedMeal!.ingredientLines).toHaveLength(1);

    const addedIngredientLine = addedMeal!.ingredientLines[0];

    expect(addedIngredientLine.id).not.toBe(ingredientLine.id);
    expect(addedIngredientLine.parentId).not.toBe(ingredientLine.parentId);
    expect(addedIngredientLine.parentType).toBe('meal');
    expect(addedIngredientLine.ingredient.id).toBe(
      ingredientLine.ingredient.id
    );
    expect(addedIngredientLine.quantityInGrams).toBe(
      ingredientLine.quantityInGrams
    );
    expect(addedIngredientLine.calories).toBe(ingredientLine.calories);
    expect(addedIngredientLine.protein).toBe(ingredientLine.protein);
  });

  it('should return DayDTO', async () => {
    const result = await addMealToDayUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create new day if not exist and add meal ', async () => {
    const currentDays = await daysRepo.getAllDays();
    expect(currentDays.length).toBe(1);

    const nonExistentdayId = '11110204';

    const result = await addMealToDayUsecase.execute({
      dayId: nonExistentdayId,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result.id).toEqual(nonExistentdayId);
    expect(result.mealIds).toHaveLength(1);

    const allDays = await daysRepo.getAllDays();
    expect(allDays.length).toBe(2);
  });

  it('should create new meal', async () => {
    const initialMeals = await mealsRepo.getAllMeals();
    expect(initialMeals.length).toBe(0);

    await addMealToDayUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    const allMeals = await mealsRepo.getAllMeals();
    expect(allMeals.length).toBe(1);
  });

  it('should throw error if user does not exist', async () => {
    const date = '20231001';
    const nonExistentUserId = 'non-existent-user';

    await expect(
      addMealToDayUsecase.execute({
        dayId: date,
        userId: nonExistentUserId,
        recipeId: recipe.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        dayId: date,
        userId: nonExistentUserId,
        recipeId: recipe.id,
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*user.*not.*found/);
  });

  it('should throw error if recipe does not exist', async () => {
    await expect(
      addMealToDayUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
        recipeId: 'non-existent-recipe',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
        recipeId: 'non-existent-recipe',
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*Recipe.*not.*found/);
  });
});
