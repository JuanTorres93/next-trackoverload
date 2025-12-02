import { getGetters } from './_getGettersUtil';
import { toRecipeDTO, RecipeDTO } from '../RecipeDTO';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import * as vp from '@/../tests/createProps';

describe('RecipeDTO', () => {
  let recipe: Recipe;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let recipeDTO: RecipeDTO;

  beforeEach(() => {
    ingredient = Ingredient.create(vp.validIngredientProps);
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });
    recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });
  });

  describe('toRecipeDTO', () => {
    beforeEach(() => {
      recipeDTO = toRecipeDTO(recipe);
    });

    it('should have a prop for each recipe getter', () => {
      const recipeGetters: string[] = getGetters(recipe);

      for (const getter of recipeGetters) {
        expect(recipeDTO).toHaveProperty(getter);
      }
    });

    it('should convert Recipe to RecipeDTO', () => {
      expect(recipeDTO).toEqual({
        id: recipe.id,
        userId: recipe.userId,
        name: recipe.name,
        imageUrl: recipe.imageUrl,
        ingredientLines: recipe.ingredientLines.map((line) => ({
          id: line.id,
          parentId: line.parentId,
          parentType: line.parentType,
          ingredient: {
            id: line.ingredient.id,
            name: line.ingredient.name,
            nutritionalInfoPer100g: line.ingredient.nutritionalInfoPer100g,
            imageUrl: line.ingredient.imageUrl,
            createdAt: line.ingredient.createdAt.toISOString(),
            updatedAt: line.ingredient.updatedAt.toISOString(),
          },
          quantityInGrams: line.quantityInGrams,
          calories: line.calories,
          protein: line.protein,
          createdAt: line.createdAt.toISOString(),
          updatedAt: line.updatedAt.toISOString(),
        })),
        calories: recipe.calories,
        protein: recipe.protein,
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof recipeDTO.createdAt).toBe('string');
      expect(typeof recipeDTO.updatedAt).toBe('string');
      expect(recipeDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(recipeDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include nested ingredient line DTOs', () => {
      expect(recipeDTO.ingredientLines).toHaveLength(1);
      const ingredientLineDTO = recipeDTO.ingredientLines[0];

      const ingredientLineGetters = getGetters(ingredientLine);
      for (const getter of ingredientLineGetters) {
        expect(ingredientLineDTO).toHaveProperty(getter);
      }
    });

    it('should include nested ingredient DTOs within ingredient lines', () => {
      const ingredientLineDTO = recipeDTO.ingredientLines[0];
      const ingredientGetters = getGetters(ingredient);

      for (const getter of ingredientGetters) {
        expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
      }
    });

    it('should handle optional imageUrl', () => {
      const recipeWithImage = Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        imageUrl: 'https://example.com/recipe.jpg',
        ingredientLines: [ingredientLine],
      });

      const dto = toRecipeDTO(recipeWithImage);
      expect(dto.imageUrl).toBe('https://example.com/recipe.jpg');
    });
  });
});
