import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import * as recipeTestProps from '../../../../tests/createProps/recipeTestProps';
import { fromRecipeDTO, RecipeDTO, toRecipeDTO } from '../RecipeDTO';

describe('RecipeDTO', () => {
  let recipe: Recipe;
  let recipeDTO: RecipeDTO;

  beforeEach(() => {
    recipe = recipeTestProps.createTestRecipe({}, 1);
  });

  describe('toRecipeDTO', () => {
    beforeEach(() => {
      recipeDTO = toRecipeDTO(recipe);
    });

    it('should have a prop for each recipe getter', () => {
      for (const getter of dto.recipeDTOProperties) {
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

      for (const getter of dto.ingredientLineDTOProperties) {
        expect(ingredientLineDTO).toHaveProperty(getter);
      }
    });

    it('should include nested ingredient DTOs within ingredient lines', () => {
      const ingredientLineDTO = recipeDTO.ingredientLines[0];

      for (const getter of dto.ingredientDTOProperties) {
        expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
      }
    });

    it('should handle optional imageUrl', () => {
      const recipeWithImage = recipeTestProps.createTestRecipe(
        {
          imageUrl: 'https://example.com/recipe.jpg',
        },
        1,
      );

      const dto = toRecipeDTO(recipeWithImage);
      expect(dto.imageUrl).toBe('https://example.com/recipe.jpg');
    });
  });

  describe('fromRecipeDTO', () => {
    beforeEach(() => {
      recipeDTO = toRecipeDTO(recipe);
    });

    it('should convert RecipeDTO to Recipe', () => {
      const reconstructedRecipe = fromRecipeDTO(recipeDTO);

      expect(reconstructedRecipe).toBeInstanceOf(Recipe);
    });

    it('should reconstruct nested IngredientLine entities', () => {
      const reconstructedRecipe = fromRecipeDTO(recipeDTO);

      expect(reconstructedRecipe.ingredientLines).toHaveLength(1);
      expect(reconstructedRecipe.ingredientLines[0]).toBeInstanceOf(
        IngredientLine,
      );
    });

    it('should reconstruct nested Ingredient entities within ingredient lines', () => {
      const reconstructedRecipe = fromRecipeDTO(recipeDTO);
      const reconstructedIngredient =
        reconstructedRecipe.ingredientLines[0].ingredient;

      expect(reconstructedIngredient).toBeInstanceOf(Ingredient);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedRecipe = fromRecipeDTO(recipeDTO);
      const reconvertedDTO = toRecipeDTO(reconstructedRecipe);

      expect(reconvertedDTO).toEqual(recipeDTO);
    });

    it('should handle recipes with multiple ingredient lines', () => {
      const recipeWithMultipleLines = recipeTestProps.createTestRecipe({}, 2);

      const dto = toRecipeDTO(recipeWithMultipleLines);
      const reconstructed = fromRecipeDTO(dto);

      expect(reconstructed.ingredientLines).toHaveLength(2);
      expect(reconstructed.ingredientLines[0].id).toBe(
        recipeTestProps.validRecipePropsWithIngredientLines().ingredientLines[0]
          .id,
      );
      expect(reconstructed.ingredientLines[1].id).toBe(
        recipeTestProps.validRecipePropsWithIngredientLines().ingredientLines[1]
          .id,
      );
    });
  });
});
