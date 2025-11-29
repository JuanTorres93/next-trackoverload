import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '../../ingredient/Ingredient';
import { IngredientLine } from '../../ingredientline/IngredientLine';
import { Recipe, RecipeCreateProps } from '../Recipe';

import * as vp from '@/../tests/createProps';

describe('Recipe', () => {
  let recipe: Recipe;
  let validRecipeProps: RecipeCreateProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    const validIngredient = Ingredient.create(vp.validIngredientProps);

    validIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
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
      ...vp.ingredientLineRecipePropsNoIngredient,
      id: 'another-line-id',
      quantityInGrams: 50,
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        calories: 200,
        protein: 20,
      }),
    });

    const recipeWithTwoLines = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.calories).toBe(200);
  });

  it('should compute total protein', async () => {
    expect(recipe.protein).toBe(vp.validIngredientProps.protein);

    const anotherIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      id: 'another-line-id',
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        calories: 200,
        protein: 10,
      }),
      quantityInGrams: 100,
    });

    const recipeWithTwoLines = Recipe.create({
      ...validRecipeProps,
      ingredientLines: [validIngredientLine, anotherIngredientLine],
    });

    expect(recipeWithTwoLines.protein).toBe(
      vp.validIngredientProps.protein + 10
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
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: Ingredient.create({
        ...vp.validIngredientProps,
        id: 'other-ing-id',
        calories: 200,
        protein: 20,
      }),
      id: 'another-line-id',
      quantityInGrams: 50,
    });
    recipe.addIngredientLine(anotherIngredientLine);
    expect(recipe.ingredientLines.length).toBe(2);
  });

  it('should remove ingredient line based on ingredient id', async () => {
    expect(recipe.ingredientLines.length).toBe(1);
    recipe.addIngredientLine(
      IngredientLine.create({
        ...vp.ingredientLineRecipePropsNoIngredient,
        id: 'another-line-id',
        ingredient: Ingredient.create({
          ...vp.validIngredientProps,
          id: 'other-ing-id',
          calories: 200,
          protein: 20,
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
      ...vp.ingredientLineRecipePropsNoIngredient,
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

  it('should throw error if id is no instance of Id', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        // @ts-expect-error Testing invalid id type
        id: 123,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        // @ts-expect-error Testing invalid id type
        id: 123,
      });
    }).toThrowError(/Id.*string/);
  });

  it('should throw error if userId is no instance of Id', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        // @ts-expect-error Testing invalid id type
        userId: 123,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        // @ts-expect-error Testing invalid id type
        userId: 123,
      });
    }).toThrowError(/Id.*string/);
  });

  it('should throw error if name is greater than 100 characters', async () => {
    const longName = 'a'.repeat(101);
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        name: longName,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        name: longName,
      });
    }).toThrowError(/Text.*not exceed/);
  });

  it('should throw error if name is empty', async () => {
    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        name: '',
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Recipe.create({
        ...validRecipeProps,
        name: '',
      });
    }).toThrowError(/Text.*cannot be empty/);
  });
});
