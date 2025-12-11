import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;

  let removeMealFromDayUsecase: RemoveMealFromDayUsecase;
  let user: User;
  let meal: Meal;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo
    );

    const ingredient = Ingredient.create(vp.validIngredientProps);
    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 150,
    });

    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    day = Day.create({
      ...vp.validDayProps(),
    });

    user = User.create({
      ...vp.validUserProps,
    });

    day.addMeal(meal.id);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);
  });

  it('should remove meal from day', async () => {
    const result = await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    expect(result.mealIds).toHaveLength(0);
  });

  it('should remove meal from repo', async () => {
    const initialMeals = await mealsRepo.getAllMeals();
    expect(initialMeals).toHaveLength(1);

    await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    const mealsAfterRemoval = await mealsRepo.getAllMeals();
    expect(mealsAfterRemoval).toHaveLength(0);
  });

  it('should not affect fake meals', async () => {
    day.addFakeMeal("fakeMeal1");
    await daysRepo.saveDay(day);

    await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    const updatedDay = await daysRepo.getDayByIdAndUserId(day.id, vp.userId);
    expect(updatedDay!.fakeMealIds).toHaveLength(1);
    expect(updatedDay!.fakeMealIds[0]).toBe("fakeMeal1");
  })

  it('should return a DayDTO', async () => {
    const result = await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.mealPropsNoIngredientLines.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw error if day does not exist', async () => {
    const date = '11111001';

    await expect(
      removeMealFromDayUsecase.execute({
        date,
        userId: vp.userId,
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if meal does not exist in day', async () => {
    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(/RemoveMealFromDay.*User.*not.*found/);
  });
});
