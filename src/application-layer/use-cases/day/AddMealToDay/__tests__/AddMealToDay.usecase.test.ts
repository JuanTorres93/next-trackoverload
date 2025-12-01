import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
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
      date: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result.meals).toHaveLength(1);

    expect(result.id).not.toBeUndefined();
    expect(result.id).not.toBe(recipe.id);
    expect(result.id).toBe(day.id);
  });

  it('should create new independent ingredient lines from recipe', async () => {
    const result = await addMealToDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    const addedMeal = result.meals[0] as MealDTO;

    expect(addedMeal.ingredientLines).toHaveLength(
      recipe.ingredientLines.length
    );
    expect(addedMeal.ingredientLines).toHaveLength(1);

    const addedIngredientLine = addedMeal.ingredientLines[0];

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
      date: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create new day and add meal if day does not exist', async () => {
    const dayId = '20231001';
    expect(day.meals).toHaveLength(0);

    const result = await addMealToDayUsecase.execute({
      date: dayId,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result.id).toEqual(dayId);
    expect(result.meals).toHaveLength(1);
  });

  it('should create new meal', async () => {
    expect(day.meals).toHaveLength(0);

    const result = await addMealToDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      recipeId: recipe.id,
    });

    expect(result.meals).toHaveLength(1);
  });

  it('should throw error if user does not exist', async () => {
    const date = '20231001';
    const nonExistentUserId = 'non-existent-user';

    await expect(
      addMealToDayUsecase.execute({
        date,
        userId: nonExistentUserId,
        recipeId: recipe.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        date,
        userId: nonExistentUserId,
        recipeId: recipe.id,
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*user.*not.*found/);
  });

  it('should throw error if recipe does not exist', async () => {
    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        recipeId: 'non-existent-recipe',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        recipeId: 'non-existent-recipe',
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*Recipe.*not.*found/);
  });
});
