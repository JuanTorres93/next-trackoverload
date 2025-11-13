import { beforeEach, describe, expect, it } from 'vitest';

import { Recipe, RecipeProps } from '../Recipe';
import { Ingredient } from '../../ingredient/Ingredient';
import { IngredientLine } from '../../ingredient/IngredientLine';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';

describe('Recipe', () => {
  let recipe: Recipe;
  let validRecipeProps: RecipeProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    const validIngredient = Ingredient.create(vp.validIngredientProps);

    validIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: validIngredient,
      quantityInGrams: 100,
    });

    validRecipeProps = {
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [validIngredientLine],
    };
    recipe = Recipe.create(validRecipeProps);
  });

  it('should create a valid recipe', () => {
    expect(recipe).toBeInstanceOf(Recipe);
  });

  it('should compute total calories', async () => {
    expect(recipe.calories).toBe(100);

    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: '2',
      quantityInGrams: 50,
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
      }),
    });

    const recipeWithTwoLines = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.calories).toBe(200);
  });

  it('should compute total protein', async () => {
    expect(recipe.protein).toBe(
      vp.validIngredientProps.nutritionalInfoPer100g.protein
    );

    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: '2',
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 10,
        },
      }),
      quantityInGrams: 100,
    });

    const recipeWithTwoLines = Recipe.create({
      ...validRecipeProps,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.protein).toBe(
      vp.validIngredientProps.nutritionalInfoPer100g.protein + 10
    );
  });

  it('should update its name', async () => {
    expect(recipe.name).toBe(vp.recipePropsNoIngredientLines.name);
    recipe.rename('New Cake');
    expect(recipe.name).toBe('New Cake');
  });

  it('should add a new ingredient line', async () => {
    expect(recipe.ingredientLines.length).toBe(1);
    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: '2',
        nutritionalInfoPer100g: {
          calories: 200,
          protein: 20,
        },
      }),
      id: '2',
      quantityInGrams: 50,
    });
    recipe.addIngredientLine(anotherIngredientLine);
    expect(recipe.ingredientLines.length).toBe(2);
  });

  it('should remove ingredient line based on ingredient id', async () => {
    expect(recipe.ingredientLines.length).toBe(1);
    recipe.addIngredientLine(
      IngredientLine.create({
        ...vp.ingredientLinePropsNoIngredient,
        id: '2',
        ingredient: Ingredient.create({
          ...vp.validIngredientProps,
          id: '2',
          nutritionalInfoPer100g: {
            calories: 200,
            protein: 20,
          },
        }),
        quantityInGrams: 50,
      })
    );
    expect(recipe.ingredientLines.length).toBe(2);

    recipe.removeIngredientLineByIngredientId(vp.validIngredientProps.id);
    expect(recipe.ingredientLines.length).toBe(1);
  });

  it('should throw an error if ingredientLines is empty', async () => {
    expect(() => {
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        ingredientLines: [],
      });
    }).toThrowError(ValidationError);
  });

  it('should throw an error if ingredientLines contains invalid items', async () => {
    expect(() => {
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
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

  it('should throw an error when adding a duplicate ingredient', async () => {
    // Try to add an ingredient line with the same ingredient ID
    const duplicateIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: 'duplicate-line-id',
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: vp.validIngredientProps.id, // Same ingredient ID
      }),
      quantityInGrams: 150,
    });

    expect(() => {
      recipe.addIngredientLine(duplicateIngredientLine);
    }).toThrowError(ValidationError);

    expect(() => {
      recipe.addIngredientLine(duplicateIngredientLine);
    }).toThrowError(/already exists in recipe/);
  });
});
