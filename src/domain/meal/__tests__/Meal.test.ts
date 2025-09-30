import { beforeEach, describe, expect, it } from 'vitest';

import { Meal, MealProps } from '../Meal';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/ingredient/Ingredient';
import { IngredientLine } from '@/domain/ingredient/IngredientLine';

const nutritionalInfoPer100g = {
  calories: 100,
  protein: 10,
};

const validIngredientProps = {
  id: '1',
  name: 'Sugar',
  nutritionalInfoPer100g,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Meal', () => {
  let meal: Meal;
  let validIngredient: Ingredient;
  let validMealProps: MealProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    validIngredient = Ingredient.create(validIngredientProps);

    validIngredientLine = IngredientLine.create({
      id: '1',
      ingredient: validIngredient,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    validMealProps = {
      id: '1',
      name: 'Cake',
      ingredientLines: [validIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
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
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    meal.addIngredientLine(anotherIngredientLine);

    const newTotalCalories = meal.calories;
    expect(newTotalCalories).toBe(200);
  });

  it('should compute the correct total protein', async () => {
    const totalProtein = meal.protein;
    expect(totalProtein).toBe(10);

    // More than one ingredient line
    const anotherIngredientLine = IngredientLine.create({
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    meal.addIngredientLine(anotherIngredientLine);

    const newTotalProtein = meal.protein;
    expect(newTotalProtein).toBe(20);
  });

  it('should add a new ingredient line', async () => {
    const newIngredientLine = IngredientLine.create({
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
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
});
