import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let addMealToDayUsecase: AddMealToDayUsecase;
  let day: Day;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let meal: Meal;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    addMealToDayUsecase = new AddMealToDayUsecase(
      daysRepo,
      mealsRepo,
      usersRepo
    );
    day = Day.create({
      ...vp.validDayProps,
    });
    ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });
    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    user = User.create({
      ...vp.validUserProps,
    });

    await daysRepo.saveDay(day);
    await mealsRepo.saveMeal(meal);
    await usersRepo.saveUser(user);
  });

  it('should add meal to existing day', async () => {
    const result = await addMealToDayUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(meal.id);
  });

  it('should return DayDTO', async () => {
    const result = await addMealToDayUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create new day and add meal if day does not exist', async () => {
    const date = new Date('2023-10-02');
    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    const result = await addMealToDayUsecase.execute({
      date,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    expect(result.id).toEqual(date.toISOString());
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(meal.id);
  });

  it('should throw error if meal does not exist', async () => {
    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*meal.*not.*found/);
  });

  it('should throw error if user does not exist', async () => {
    const date = new Date('2023-10-01');
    const mealId = vp.mealPropsNoIngredientLines.id;
    const nonExistentUserId = 'non-existent-user';

    await expect(
      addMealToDayUsecase.execute({
        date,
        userId: nonExistentUserId,
        mealId,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        date,
        userId: nonExistentUserId,
        mealId,
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*user.*not.*found/);
  });

  it('should throw error if meal belongs to another user', async () => {
    const anotherUser = User.create({
      ...vp.validUserProps,
      id: 'another-user-id',
    });

    await usersRepo.saveUser(anotherUser);
    const mealId = vp.mealPropsNoIngredientLines.id;

    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: anotherUser.id,
        mealId,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addMealToDayUsecase.execute({
        date: day.id,
        userId: anotherUser.id,
        mealId,
      })
    ).rejects.toThrow(/AddMealToDayUsecase.*meal.*not.*found/);
  });
});
