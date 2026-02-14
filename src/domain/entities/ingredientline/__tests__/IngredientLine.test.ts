import { beforeEach, describe, expect, it } from 'vitest';

import { Ingredient } from '../../ingredient/Ingredient';
import { IngredientLine } from '../IngredientLine';
import { ValidationError } from '@/domain/common/errors';
import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';

const validIngredient = ingredientTestProps.createTestIngredient();

const validIngredientLineProps = {
  ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
  ingredient: validIngredient,
};

describe('IngredientLine', () => {
  let ingredientLine: IngredientLine;

  beforeEach(() => {
    ingredientLine = IngredientLine.create(validIngredientLineProps);
  });

  it('should create a valid ingredient line', () => {
    expect(ingredientLine).toBeInstanceOf(IngredientLine);
  });

  it('should create an ingredient line if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } =
      validIngredientLineProps;

    const ingredientLineWithoutDates = IngredientLine.create(propsWithoutDates);

    expect(ingredientLineWithoutDates).toBeInstanceOf(IngredientLine);

    const now = new Date();

    expect(ingredientLineWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
      now.getTime(),
    );
    expect(ingredientLineWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
      now.getTime(),
    );
  });

  it('should compute total calories', async () => {
    expect(ingredientLine.calories).toBe(200); // 100 cal per 100g * 200g = 200 cal
  });

  it('should compute total protein', async () => {
    expect(ingredientLine.protein).toBe(30); // 15 protein per 100g * 200g = 30 protein
  });

  it('should throw an error if ingredient is invalid', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        ingredient: {} as Ingredient,
      });
    }).toThrowError(ValidationError);
  });

  it('should throw an error if quantityInGrams is invalid', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: -100,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: 0,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        // @ts-expect-error testing invalid type
        quantityInGrams: '100',
      });
    }).toThrowError(ValidationError);
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(/Id/);
  });

  it('should throw error if quantityInGrams is zero', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: 0,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: 0,
      });
    }).toThrowError(/Float.*be zero/);
  });

  it('should throw error if quantityInGrams is negative', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: -50,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        quantityInGrams: -50,
      });
    }).toThrowError(/Float.*positive/);
  });

  it('should throw error if parent type is different from meal or recipe', async () => {
    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        // @ts-expect-error testing invalid type
        parentType: 'invalidType',
      });
    }).toThrowError(ValidationError);

    expect(() => {
      IngredientLine.create({
        ...validIngredientLineProps,
        // @ts-expect-error testing invalid type
        parentType: 'invalidType',
      });
    }).toThrowError(/IngredientLine.*parentType.*meal.*recipe/);
  });
});
