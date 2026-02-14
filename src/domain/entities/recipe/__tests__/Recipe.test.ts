import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '../../ingredient/Ingredient';
import { IngredientLine } from '../../ingredientline/IngredientLine';
import { Recipe, RecipeCreateProps } from '../Recipe';

import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';

describe('Recipe', () => {
  let recipe: Recipe;
  let validIngredient: Ingredient;
  let validRecipeProps: RecipeCreateProps;
  let validIngredientLine: IngredientLine;

  beforeEach(() => {
    validIngredient = ingredientTestProps.createTestIngredient();

    validIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: validIngredient,
      quantityInGrams: 100,
    });

    validRecipeProps = {
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [validIngredientLine],
    };
    recipe = Recipe.create(validRecipeProps);
  });

  describe('Behaviour', () => {
    it('should create a valid recipe', () => {
      expect(recipe).toBeInstanceOf(Recipe);
    });

    it('should create a recipe if no createdAt or updatedAt is provided', async () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } = validRecipeProps;

      const recipeWithoutDates = Recipe.create(propsWithoutDates);

      expect(recipeWithoutDates).toBeInstanceOf(Recipe);

      const now = new Date();

      expect(recipeWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
      expect(recipeWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
    });

    it('should compute total calories', async () => {
      expect(recipe.calories).toBe(100);

      const anotherIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'another-line-id',
        quantityInGrams: 50,
        ingredient: ingredientTestProps.createTestIngredient({
          id: 'other-ing-id',
          calories: 200,
          protein: 20,
        }),
      });

      const recipeWithTwoLines = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        ingredientLines: [validIngredientLine, anotherIngredientLine],
      });

      expect(recipeWithTwoLines.calories).toBe(200);
    });

    it('should compute total protein', async () => {
      expect(recipe.protein).toBe(
        validIngredient.nutritionalInfoPer100g.protein,
      );

      const anotherIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'another-line-id',
        ingredient: ingredientTestProps.createTestIngredient({
          id: 'other-ing-id',
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
        validIngredient.nutritionalInfoPer100g.protein + 10,
      );
    });

    it('should update its name', async () => {
      expect(recipe.name).toBe(
        recipeTestProps.recipePropsNoIngredientLines.name,
      );
      recipe.rename('New Cake');
      expect(recipe.name).toBe('New Cake');
    });

    it('should update its imageURL', async () => {
      // Default imageUrl contains "recipe"
      expect(recipe.imageUrl).toContain('recipe');

      const newImageUrl = 'http://example.com/new-image.png';
      recipe.updateImageUrl(newImageUrl);

      expect(recipe.imageUrl).toBe(newImageUrl);
      expect(recipe.imageUrl).not.toContain('recipe');
    });

    it('should add a new ingredient line', async () => {
      expect(recipe.ingredientLines.length).toBe(1);
      const anotherIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        ingredient: ingredientTestProps.createTestIngredient({
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
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'another-line-id',
          ingredient: ingredientTestProps.createTestIngredient({
            id: 'other-ing-id',
            calories: 200,
            protein: 20,
          }),
          quantityInGrams: 50,
        }),
      );
      expect(recipe.ingredientLines.length).toBe(2);

      recipe.removeIngredientLineByIngredientId(validIngredient.id);
      expect(recipe.ingredientLines.length).toBe(1);
    });
  });

  describe('Errors', () => {
    it('should throw an error if ingredientLines is empty', async () => {
      expect(() => {
        Recipe.create({
          ...recipeTestProps.recipePropsNoIngredientLines,
          ingredientLines: [],
        });
      }).toThrowError(ValidationError);
    });

    it('should throw an error if ingredientLines contains invalid items', async () => {
      expect(() => {
        Recipe.create({
          ...recipeTestProps.recipePropsNoIngredientLines,
          ingredientLines: [
            validIngredientLine,
            {} as unknown as IngredientLine,
          ],
        });
      }).toThrowError(ValidationError);
    });

    it('should throw an error when adding a duplicate ingredient', async () => {
      // Try to add an ingredient line with the same ingredient ID
      const duplicateIngredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'duplicate-line-id',
        ingredient: ingredientTestProps.createTestIngredient({
          id: validIngredient.id, // Same ingredient ID
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

    it('should throw error if creating recipe with duplicated ingredient', async () => {
      const ingredientLine1 = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'line-1',
        ingredient: validIngredient,
        quantityInGrams: 100,
      });

      const ingredientLine2 = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'line-2',
        ingredient: validIngredient,
        quantityInGrams: 150,
      });

      expect(() => {
        Recipe.create({
          ...recipeTestProps.recipePropsNoIngredientLines,
          ingredientLines: [ingredientLine1, ingredientLine2],
        });
      }).toThrow(ValidationError);

      expect(() => {
        Recipe.create({
          ...recipeTestProps.recipePropsNoIngredientLines,
          ingredientLines: [ingredientLine1, ingredientLine2],
        });
      }).toThrow(/Recipe.*duplicate.*ingredients/);
    });
  });
});
