import { describe, expect, it } from 'vitest';
import { Ingredient } from '../Ingredient';

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

describe('Ingredient', () => {
  it('should create a valid ingredient', () => {
    const ingredient = Ingredient.create(validIngredientProps);

    expect(ingredient).toBeInstanceOf(Ingredient);
  });

  it('should create an ingredient if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } = validIngredientProps;
    // @ts-expect-error .create actually expects createdAt and updatedAt
    const ingredient = Ingredient.create(propsWithoutDates);

    expect(ingredient).toBeInstanceOf(Ingredient);
    expect(ingredient.createdAt instanceof Date).toBe(true);
    expect(ingredient.updatedAt instanceof Date).toBe(true);
  });

  it('should update its nutritional info', async () => {
    const ingredient = Ingredient.create(validIngredientProps);
    const newNutritionalInfo = {
      calories: 200,
      protein: 20,
    };
    ingredient.updateNutritionalInfo(newNutritionalInfo);
    expect(ingredient.nutritionalInfoPer100g).toEqual(newNutritionalInfo);
  });

  it('should not update its nutritional info with invalid data', async () => {
    const ingredient = Ingredient.create(validIngredientProps);
    const invalidNutritionalInfos = [
      null,
      { calories: -10, protein: 5 },
      { calories: 100, protein: -5 },
    ];

    for (const invalidNutritionalInfo of invalidNutritionalInfos) {
      expect(() =>
        // @ts-expect-error the error comes precisely because it should not be updated
        ingredient.updateNutritionalInfo(invalidNutritionalInfo)
      ).toThrow();
    }
  });

  it('should not create an ingredient with invalid props', async () => {
    const invalidProps = [
      { id: '' },
      { id: 3 },
      { name: '' },
      { name: 3 },
      { nutritionalInfoPer100g: null },
      { nutritionalInfoPer100g: { calories: -10, protein: 5 } },
      { nutritionalInfoPer100g: { calories: 100, protein: -5 } },
      { createdAt: 'invalid date' },
      { updatedAt: 'invalid date' },
    ];

    for (const invalidProp of invalidProps) {
      const props = { ...validIngredientProps, ...invalidProp };
      // @ts-expect-error the error comes precisely because it should not be created
      expect(() => Ingredient.create(props)).toThrow();
    }
  });
});
