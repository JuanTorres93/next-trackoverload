import { describe, expect, it, beforeEach } from 'vitest';
import { Ingredient } from '../Ingredient';
import { ValidationError } from '@/domain/common/errors';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';

describe('Ingredient', () => {
  let ingredient: Ingredient;

  beforeEach(() => {
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
  });

  describe('creation', () => {
    it('should create a valid ingredient', () => {
      expect(ingredient).toBeInstanceOf(Ingredient);
    });

    it('should create an ingredient if no createdAt or updatedAt is provided', async () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } =
        ingredientTestProps.validIngredientProps;

      const ingredientWithoutDates = Ingredient.create(propsWithoutDates);

      expect(ingredientWithoutDates).toBeInstanceOf(Ingredient);

      const now = new Date();

      expect(ingredientWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
      expect(ingredientWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
    });
  });

  describe('behaviour', () => {
    it('should update ingredient', async () => {
      const patch = { name: 'Updated Ingredient', calories: 150, protein: 15 };

      ingredient.update(patch);

      expect(ingredient.name).toBe('Updated Ingredient');
      expect(ingredient.nutritionalInfoPer100g).toEqual({
        calories: 150,
        protein: 15,
      });
    });

    it('should convert to create props', () => {
      const createProps = ingredient.toCreateProps();

      expect(createProps).toEqual({
        id: ingredient.id,
        name: ingredient.name,
        calories: ingredient.nutritionalInfoPer100g.calories,
        protein: ingredient.nutritionalInfoPer100g.protein,
        imageUrl: ingredient.imageUrl,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
      });
    });
  });

  describe('errors', () => {
    it('should throw error if patch is not provided when updating', async () => {
      expect(() => {
        ingredient.update({});
      }).toThrowError(ValidationError);
      expect(() => {
        ingredient.update({});
      }).toThrowError(/Ingredient.*No patch provided/);
    });

    it('should throw error if id is not Id type', async () => {
      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          // @ts-expect-error testing invalid type
          id: 123,
        });
      }).toThrowError(ValidationError);

      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          // @ts-expect-error testing invalid type
          id: 123,
        });
      }).toThrowError(/Id.*string/);
    });

    it('should throw error if name is larger than 100 chars', async () => {
      const longName = 'a'.repeat(101);
      expect(() =>
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          name: longName,
        }),
      ).toThrow(ValidationError);

      expect(() =>
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          name: longName,
        }),
      ).toThrow(/Text.*exceed/);
    });

    it('should throw error if name is empty', async () => {
      expect(() =>
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          name: '',
        }),
      ).toThrow(ValidationError);

      expect(() =>
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          name: '',
        }),
      ).toThrow(/Text.*empty/);
    });

    it('should throw error if calores are below zero', async () => {
      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          calories: -10,
        });
      }).toThrowError(ValidationError);

      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          calories: -10,
        });
      }).toThrowError(/Float.*positive/);
    });

    it('should throw error if protein is below zero', async () => {
      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          protein: -5,
        });
      }).toThrowError(ValidationError);

      expect(() => {
        Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          protein: -5,
        });
      }).toThrowError(/Float.*positive/);
    });
  });
});
