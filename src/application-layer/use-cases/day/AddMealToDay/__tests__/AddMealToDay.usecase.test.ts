import { beforeEach, describe, expect, it } from 'vitest';
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/types/Id/Id';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let addMealToDayUsecase: AddMealToDayUsecase;
  let day: Day;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let meal: Meal;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    addMealToDayUsecase = new AddMealToDayUsecase(daysRepo, mealsRepo);
    day = Day.create({
      ...vp.validDayProps,
    });
    ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });
    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: Id.create('meal-1'),
      ingredientLines: [ingredientLine],
    });

    await daysRepo.saveDay(day);
    await mealsRepo.saveMeal(meal);
  });

  it('should add meal to existing day', async () => {
    const result = await addMealToDayUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      mealId: 'meal-1',
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(meal.id);
  });

  it('should return DayDTO', async () => {
    const result = await addMealToDayUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      mealId: 'meal-1',
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
      mealId: vp.mealPropsNoIngredientLines.id.value,
    });

    expect(result.id).toEqual(date.toISOString());
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(meal.id);
  });

  it('should throw error if meal does not exist', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';

    await expect(
      addMealToDayUsecase.execute({ date, userId, mealId: 'non-existent' })
    ).rejects.toThrow(ValidationError);
  });
});
