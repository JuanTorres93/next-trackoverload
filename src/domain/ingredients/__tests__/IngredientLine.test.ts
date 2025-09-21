import { beforeEach, describe, expect, it } from 'vitest';

import { Ingredient } from '../Ingredient';
import { IngredientLine } from '../IngredientLine';
import { ValidationError } from '@/domain/common/errors';

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

const validIngredient = Ingredient.create(validIngredientProps);

describe('IngredientLine', () => {
  let ingredientLine: IngredientLine;

  beforeEach(() => {
    ingredientLine = IngredientLine.create({
      ingredient: validIngredient,
      quantityInGrams: 100,
    });
  });

  it('should create a valid ingredient line', () => {
    expect(ingredientLine).toBeInstanceOf(IngredientLine);
  });

  it('should compute total calories', async () => {
    expect(ingredientLine.calories).toBe(100);
  });

  it('should compute total protein', async () => {
    expect(ingredientLine.protein).toBe(10);
  });

  it('should throw an error if ingredient is invalid', async () => {
    expect(() => {
      IngredientLine.create({
        ingredient: {} as unknown as Ingredient,
        quantityInGrams: 100,
      });
    }).toThrowError(ValidationError);
  });

  it('should throw an error if quantityInGrams is invalid', async () => {
    expect(() => {
      IngredientLine.create({
        ingredient: validIngredient,
        quantityInGrams: -100,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ingredient: validIngredient,
        quantityInGrams: 0,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ingredient: validIngredient,
        // @ts-expect-error testing invalid type
        quantityInGrams: '100',
      });
    }).toThrowError(ValidationError);
  });
});
