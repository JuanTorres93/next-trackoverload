import { beforeEach, describe, expect, it } from 'vitest';

import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { FakeMeal } from '../../fakemeal/FakeMeal';
import { Meal } from '../../meal/Meal';
import { Day } from '../Day';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';

describe('Day', () => {
  let day: Day;
  let fakeMeal: FakeMeal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let meal: Meal;

  beforeEach(() => {
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);
    ingredient = Ingredient.create(vp.validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal, meal],
    });
  });

  it('should create a valid day', () => {
    expect(day).toBeInstanceOf(Day);
  });

  it('should throw error if meals are not Meal or FakeMeal instances', async () => {
    const invalidMeals = [
      {},
      3,
      'invalid',
      { id: 'not-a-meal' },
      null,
      undefined,
      42,
      [fakeMeal],
    ];

    invalidMeals.forEach((invalidMeal) => {
      expect(() =>
        Day.create({
          ...vp.validDayProps,
          // @ts-expect-error Testing invalid input
          meals: [invalidMeal],
        })
      ).toThrow(ValidationError);
    });
  });

  it('should compute total calories', async () => {
    const totalCalories = day.calories;
    expect(totalCalories).toBe(400);
  });

  it('should compute total protein', async () => {
    const totalProtein = day.protein;
    expect(totalProtein).toBe(60);
  });

  it('should add meal', async () => {
    const initialLength = day.meals.length;

    const newMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: 'meal2',
      name: 'Another Meal',
      ingredientLines: [ingredientLine],
    });

    day.addMeal(newMeal);
    expect(day.meals).toHaveLength(initialLength + 1);
    expect(day.meals[day.meals.length - 1]).toEqual(newMeal);
  });

  it('should not add invalid meal', async () => {
    const initialLength = day.meals.length;

    const invalidMeals = [
      {},
      3,
      'invalid',
      { id: 'not-a-meal' },
      null,
      42,
      [fakeMeal],
    ];

    invalidMeals.forEach((invalidMeal) => {
      // @ts-expect-error Testing invalid input
      expect(() => day.addMeal(invalidMeal)).toThrow(ValidationError);
      expect(day.meals).toHaveLength(initialLength);
    });
  });

  it('should remove meal', async () => {
    const initialLength = day.meals.length;

    day.removeMealById('fakeMeal1');

    expect(day.meals).toHaveLength(initialLength - 1);
    expect(day.meals).not.toContain(fakeMeal);
  });

  it('should have meals', async () => {
    expect(day).toHaveProperty('meals');
    expect(Array.isArray(day.meals)).toBe(true);
  });
});
