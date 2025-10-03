import { beforeEach, describe, expect, it } from 'vitest';

import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { FakeMeal } from '../../fakemeal/FakeMeal';
import { Meal } from '../../meal/Meal';
import { Day } from '../Day';

const validFakeMealProps = {
  id: 'fakemeal1',
  name: 'Fake Chicken Breast',
  protein: 30,
  calories: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const validIngredientProps = {
  id: 'ing1',
  name: 'Chicken Breast',
  nutritionalInfoPer100g: {
    calories: 100,
    protein: 15,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Day', () => {
  let day: Day;
  let fakeMeal: FakeMeal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let meal: Meal;

  beforeEach(() => {
    fakeMeal = FakeMeal.create(validFakeMealProps);
    ingredient = Ingredient.create(validIngredientProps);

    ingredientLine = IngredientLine.create({
      id: 'line1',
      ingredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    meal = Meal.create({
      id: 'meal1',
      name: 'Chicken Meal',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    day = Day.create({
      id: new Date('2023-10-01'),
      meals: [fakeMeal, meal],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should create a valid day', () => {
    expect(day).toBeInstanceOf(Day);
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
      id: 'meal2',
      name: 'Another Meal',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    day.addMeal(newMeal);
    expect(day.meals).toHaveLength(initialLength + 1);
    expect(day.meals[day.meals.length - 1]).toEqual(newMeal);
  });

  it('should remove meal', async () => {
    const initialLength = day.meals.length;

    day.removeMealById('fakemeal1');

    expect(day.meals).toHaveLength(initialLength - 1);
    expect(day.meals).not.toContain(fakeMeal);
  });

  it('should have meals', async () => {
    expect(day).toHaveProperty('meals');
    expect(Array.isArray(day.meals)).toBe(true);
  });
});
