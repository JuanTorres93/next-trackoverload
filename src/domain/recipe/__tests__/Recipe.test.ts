import { beforeEach, describe, expect, it } from 'vitest';

import { Recipe } from '../Recipe';
import { Ingredient } from '../../ingredient/Ingredient';
import { IngredientLine } from '../../ingredient/IngredientLine';
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

const validIngredientLine = IngredientLine.create({
  id: '1',
  ingredient: validIngredient,
  quantityInGrams: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const validRecipeProps = {
  id: '1',
  name: 'Cake',
  ingredientLines: [validIngredientLine],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Recipe', () => {
  let recipe: Recipe;

  beforeEach(() => {
    recipe = Recipe.create(validRecipeProps);
  });

  it('should create a valid recipe', () => {
    expect(recipe).toBeInstanceOf(Recipe);
  });

  it('should compute total calories', async () => {
    expect(recipe.totalCalories).toBe(100);

    const anotherIngredientLine = IngredientLine.create({
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const recipeWithTwoLines = Recipe.create({
      ...validRecipeProps,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.totalCalories).toBe(200);
  });

  it('should compute total protein', async () => {
    expect(recipe.totalProtein).toBe(10);

    const anotherIngredientLine = IngredientLine.create({
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const recipeWithTwoLines = Recipe.create({
      ...validRecipeProps,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.totalProtein).toBe(20);
  });

  it('should update its name', async () => {
    expect(recipe.name).toBe('Cake');
    recipe.rename('New Cake');
    expect(recipe.name).toBe('New Cake');
  });

  it('should add a new ingredient line', async () => {
    expect(recipe.ingredientLines.length).toBe(1);
    const anotherIngredientLine = IngredientLine.create({
      id: '2',
      ingredient: Ingredient.create({
        ...validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
      }),
      quantityInGrams: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    recipe.addIngredientLine(anotherIngredientLine);
    expect(recipe.ingredientLines.length).toBe(2);
  });

  it('should remove ingredient line based on ingredient id', async () => {
    expect(recipe.ingredientLines.length).toBe(2);

    recipe.removeIngredientLineByIngredientId('1');
    expect(recipe.ingredientLines.length).toBe(1);
    expect(recipe.ingredientLines[0].ingredient.id).toBe('2');
  });

  it('should throw an error if ingredientLines is empty', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        ingredientLines: [],
      });
    }).toThrowError(ValidationError);
  });

  it('should throw an error if ingredientLines contains invalid items', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        ingredientLines: [validIngredientLine, {} as unknown as IngredientLine],
      });
    }).toThrowError(ValidationError);
  });

  it('should throw an error if name is invalid', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        name: '',
      });
    }).toThrowError(ValidationError);
  });
});
