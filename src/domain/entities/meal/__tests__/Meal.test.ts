import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal, MealCreateProps } from '../Meal';

describe('Meal', () => {
  let meal: Meal;
  let validIngredient: Ingredient;
  let validMealProps: MealCreateProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    validIngredient = Ingredient.create(vp.validIngredientProps);

    validIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: validIngredient,
      quantityInGrams: 100,
    });

    validMealProps = {
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [validIngredientLine],
    };
    meal = Meal.create(validMealProps);
  });

  it('should create a valid meal', () => {
    expect(meal).toBeInstanceOf(Meal);
  });

  it('should compute the correct total calories', async () => {
    const totalCalories = meal.calories;
    expect(totalCalories).toBe(100);

    // More than one ingredient line
    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: 'other-ing',
        calories: 200,
        protein: 20,
      }),
      quantityInGrams: 50,
    });

    meal.addIngredientLine(anotherIngredientLine);

    const newTotalCalories = meal.calories;
    expect(newTotalCalories).toBe(200);
  });

  it('should compute the correct total protein', async () => {
    const totalProtein = meal.protein;
    expect(totalProtein).toBe(vp.validIngredientProps.protein);

    // More than one ingredient line
    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: 'another-line-id',
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: 'other-ing',
        calories: 200,
        protein: 20,
      }),
      quantityInGrams: 50,
    });
    meal.addIngredientLine(anotherIngredientLine);

    const newTotalProtein = meal.protein;
    expect(newTotalProtein).toBe(vp.validIngredientProps.protein + 10);
  });

  it('should add a new ingredient line', async () => {
    const newIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: 'new-line',
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: 'other-ing',
      }),
    });

    meal.addIngredientLine(newIngredientLine);

    expect(meal.ingredientLines).toHaveLength(2);
    expect(meal.ingredientLines[1]).toEqual(newIngredientLine);
  });

  it('should remove an ingredient line based on ingredient id', async () => {
    const ingredientIdToRemove = validIngredient.id;

    meal.removeIngredientLineByIngredientId(ingredientIdToRemove);
    expect(meal.ingredientLines).toHaveLength(0);
  });

  it('should throw validation error for empty name', () => {
    expect(() =>
      Meal.create({
        ...validMealProps,
        name: '',
      })
    ).toThrow(ValidationError);
  });

  it('should throw validation error for empty ingredient lines', () => {
    expect(() =>
      Meal.create({
        ...validMealProps,
        ingredientLines: [],
      })
    ).toThrow(ValidationError);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidIds = [null, undefined, 23, true, {}, '', '  ', []];

    for (const invalidId of invalidIds) {
      expect(() =>
        Meal.create({
          ...validMealProps,
          // @ts-expect-error Testing invalid inputs
          userId: invalidId,
        })
      ).toThrow(ValidationError);
    }
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() =>
      Meal.create({
        ...validMealProps,
        // @ts-expect-error Testing invalid inputs
        id: 123,
      })
    ).toThrow(ValidationError);

    expect(() =>
      Meal.create({
        ...validMealProps,
        // @ts-expect-error Testing invalid inputs
        id: 123,
      })
    ).toThrow(/Id.*string/);
  });

  it('should throw error if userId is not instance of Id', async () => {
    expect(() =>
      Meal.create({
        ...validMealProps,
        // @ts-expect-error Testing invalid inputs
        userId: 123,
      })
    ).toThrow(ValidationError);

    expect(() =>
      Meal.create({
        ...validMealProps,
        // @ts-expect-error Testing invalid inputs
        userId: 123,
      })
    ).toThrow(/Id.*string/);
  });
});
