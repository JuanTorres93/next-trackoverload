import * as recipeTestProps from '../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../tests/createProps/ingredientTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import {
  fromIngredientLineDTO,
  IngredientLineDTO,
  toIngredientLineDTO,
} from '../IngredientLineDTO';

describe('IngredientLineDTO', () => {
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let ingredientLineDTO: IngredientLineDTO;

  beforeEach(() => {
    ingredient = ingredientTestProps.createTestIngredient();

    ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });
  });

  describe('toIngredientLineDTO', () => {
    beforeEach(() => {
      ingredientLineDTO = toIngredientLineDTO(ingredientLine);
    });

    it('should have a prop for each ingredient line getter', async () => {
      for (const getter of dto.ingredientLineDTOProperties) {
        expect(ingredientLineDTO).toHaveProperty(getter);
      }
    });

    it('should convert IngredientLine to IngredientLineDTO', () => {
      expect(ingredientLineDTO).toEqual({
        id: ingredientLine.id,
        parentId: ingredientLine.parentId,
        parentType: ingredientLine.parentType,
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          nutritionalInfoPer100g: ingredient.nutritionalInfoPer100g,
          imageUrl: ingredient.imageUrl,
          createdAt: ingredient.createdAt.toISOString(),
          updatedAt: ingredient.updatedAt.toISOString(),
        },
        quantityInGrams: ingredientLine.quantityInGrams,
        calories: ingredientLine.calories,
        protein: ingredientLine.protein,
        createdAt: ingredientLine.createdAt.toISOString(),
        updatedAt: ingredientLine.updatedAt.toISOString(),
      });
    });

    it('should include nested ingredient DTO', () => {
      for (const getter of dto.ingredientDTOProperties) {
        expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
      }
    });

    it('should calculate calories correctly', () => {
      // 100 cal per 100g * 200g = 200 cal
      expect(ingredientLineDTO.calories).toBe(200);
    });

    it('should calculate protein correctly', () => {
      // 15 protein per 100g * 200g = 30 protein
      expect(ingredientLineDTO.protein).toBe(30);
    });
  });

  describe('fromIngredientLineDTO', () => {
    beforeEach(() => {
      ingredientLineDTO = toIngredientLineDTO(ingredientLine);
    });

    it('should convert IngredientLineDTO to IngredientLine', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);

      expect(reconstructedIngredientLine).toBeInstanceOf(IngredientLine);
    });

    it('should reconstruct nested Ingredient entity', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);

      expect(reconstructedIngredientLine.ingredient).toBeInstanceOf(Ingredient);
      expect(reconstructedIngredientLine.ingredient.id).toBe(ingredient.id);
      expect(reconstructedIngredientLine.ingredient.name).toBe(ingredient.name);
      expect(
        reconstructedIngredientLine.ingredient.nutritionalInfoPer100g,
      ).toEqual(ingredient.nutritionalInfoPer100g);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);
      const reconvertedDTO = toIngredientLineDTO(reconstructedIngredientLine);

      expect(reconvertedDTO).toEqual(ingredientLineDTO);
    });

    it('should handle ingredient lines with optional imageUrl', () => {
      const ingredientWithImage = ingredientTestProps.createTestIngredient();

      const ingredientLineWithImage = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        ingredient: ingredientWithImage,
      });

      const dto = toIngredientLineDTO(ingredientLineWithImage);
      const reconstructed = fromIngredientLineDTO(dto);

      expect(reconstructed.ingredient.imageUrl).toBe(
        'https://example.com/image.jpg',
      );
    });
  });
});
