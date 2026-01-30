import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal, MealCreateProps } from '../Meal';

describe('Meal', () => {
  let meal: Meal;
  let validIngredient: Ingredient;
  let validMealProps: MealCreateProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    validIngredient = Ingredient.create(
      ingredientTestProps.validIngredientProps,
    );

    validIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: validIngredient,
      quantityInGrams: 100,
    });

    validMealProps = {
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [validIngredientLine],
    };
    meal = Meal.create(validMealProps);
  });

  describe('Creation', () => {
    it('should create a valid meal', () => {
      expect(meal).toBeInstanceOf(Meal);
    });
  });

  describe('Functionality', () => {
    it('should compute the correct total calories', async () => {
      const totalCalories = meal.calories;
      expect(totalCalories).toBe(100);

      // More than one ingredient line
      const anotherIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        ingredient: Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
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
      expect(totalProtein).toBe(
        ingredientTestProps.validIngredientProps.protein,
      );

      // More than one ingredient line
      const anotherIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'another-line-id',
        ingredient: Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'other-ing',
          calories: 200,
          protein: 20,
        }),
        quantityInGrams: 50,
      });
      meal.addIngredientLine(anotherIngredientLine);

      const newTotalProtein = meal.protein;
      expect(newTotalProtein).toBe(
        ingredientTestProps.validIngredientProps.protein + 10,
      );
    });

    it('should add a new ingredient line', async () => {
      const newIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'new-line',
        ingredient: Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'other-ing',
        }),
      });

      meal.addIngredientLine(newIngredientLine);

      expect(meal.ingredientLines).toHaveLength(2);
      expect(meal.ingredientLines[1]).toEqual(newIngredientLine);
    });

    it('should not add ingredient line with already existing ingredient', async () => {
      const duplicateIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        ingredient: validIngredient,
      });

      expect(() => meal.addIngredientLine(duplicateIngredientLine)).toThrow(
        ValidationError,
      );
      expect(() => meal.addIngredientLine(duplicateIngredientLine)).toThrow(
        /Meal:.*ingredient.*already exists.*meal/i,
      );
    });

    it('should remove an ingredient line based on ingredient id', async () => {
      const newIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'new-ing',
      });

      const newIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'new-line',
        ingredient: newIngredient,
      });

      meal.addIngredientLine(newIngredientLine);
      expect(meal.ingredientLines).toHaveLength(2);

      const ingredientIdToRemove = newIngredientLine.ingredient.id;

      meal.removeIngredientLineByIngredientId(ingredientIdToRemove);
      expect(meal.ingredientLines).toHaveLength(1);
    });

    it('should not be able to remove all ingredient lines, at least one must exist', async () => {
      const ingredientIdToRemove = validIngredient.id;

      expect(() =>
        meal.removeIngredientLineByIngredientId(ingredientIdToRemove),
      ).toThrow(ValidationError);
      expect(() =>
        meal.removeIngredientLineByIngredientId(ingredientIdToRemove),
      ).toThrow(/Meal:.*At least one.*ingredient.*line.*exist/i);
    });
  });

  describe('Errors', () => {
    it('should throw validation error for empty ingredient lines', () => {
      expect(() =>
        Meal.create({
          ...validMealProps,
          ingredientLines: [],
        }),
      ).toThrow(ValidationError);
      expect(() =>
        Meal.create({
          ...validMealProps,
          ingredientLines: [],
        }),
      ).toThrow(/Meal:.*ingredientLines.*non-empty.*array/);
    });

    it('should throw error for invalid ingredient lines', async () => {
      const invalidLines = [null, undefined, 42, 'invalid', {}, []];

      for (const invalidLine of invalidLines) {
        expect(() =>
          Meal.create({
            ...validMealProps,
            // @ts-expect-error Testing invalid inputs
            ingredientLines: [invalidLine],
          }),
        ).toThrow(ValidationError);
        expect(() =>
          Meal.create({
            ...validMealProps,
            // @ts-expect-error Testing invalid inputs
            ingredientLines: [invalidLine],
          }),
        ).toThrow(/Meal:.*ingredientLines.*IngredientLine/);
      }
    });

    it('should throw error if name is greater than 100 chars', async () => {
      expect(() => {
        Meal.create({
          ...validMealProps,
          name: 'a'.repeat(101),
        });
      }).toThrow(ValidationError);

      expect(() => {
        Meal.create({
          ...validMealProps,
          name: 'a'.repeat(101),
        });
      }).toThrow(/Text.*not exceed/);
    });

    it('should throw error if no patch is specified when updating', async () => {
      expect(() => meal.update({})).toThrow(ValidationError);
      expect(() => meal.update({})).toThrow(/Meal.*No.*patch/);
    });
  });
});
