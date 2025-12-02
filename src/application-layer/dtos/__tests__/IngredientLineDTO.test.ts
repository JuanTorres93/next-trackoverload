import { getGetters } from '../utils/getGetters';
import {
  toIngredientLineDTO,
  fromIngredientLineDTO,
  IngredientLineDTO,
} from '../IngredientLineDTO';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import * as vp from '@/../tests/createProps';

describe('IngredientLineDTO', () => {
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let ingredientLineDTO: IngredientLineDTO;

  beforeEach(() => {
    ingredient = Ingredient.create(vp.validIngredientProps);
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });
  });

  describe('toIngredientLineDTO', () => {
    beforeEach(() => {
      ingredientLineDTO = toIngredientLineDTO(ingredientLine);
    });

    it('should have a prop for each ingredient line getter', async () => {
      const ingredientLineGetters: string[] = getGetters(ingredientLine);

      for (const getter of ingredientLineGetters) {
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
      const ingredientGetters = getGetters(ingredientLine.ingredient);

      for (const getter of ingredientGetters) {
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
        reconstructedIngredientLine.ingredient.nutritionalInfoPer100g
      ).toEqual(ingredient.nutritionalInfoPer100g);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);
      const reconvertedDTO = toIngredientLineDTO(reconstructedIngredientLine);

      expect(reconvertedDTO).toEqual(ingredientLineDTO);
    });

    it('should handle ingredient lines with optional imageUrl', () => {
      const ingredientWithImage = Ingredient.create({
        ...vp.validIngredientProps,
        imageUrl: 'https://example.com/image.jpg',
      });

      const ingredientLineWithImage = IngredientLine.create({
        ...vp.ingredientLineRecipePropsNoIngredient,
        ingredient: ingredientWithImage,
      });

      const dto = toIngredientLineDTO(ingredientLineWithImage);
      const reconstructed = fromIngredientLineDTO(dto);

      expect(reconstructed.ingredient.imageUrl).toBe(
        'https://example.com/image.jpg'
      );
    });
  });
});
