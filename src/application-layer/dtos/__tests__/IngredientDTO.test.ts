import { getGetters } from './_getGettersUtil';
import {
  toIngredientDTO,
  fromIngredientDTO,
  IngredientDTO,
} from '../IngredientDTO';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import * as vp from '@/../tests/createProps';

describe('IngredientDTO', () => {
  let ingredient: Ingredient;
  let ingredientDTO: IngredientDTO;

  beforeEach(() => {
    ingredient = Ingredient.create(vp.validIngredientProps);
  });

  describe('toIngredientDTO', () => {
    beforeEach(() => {
      ingredientDTO = toIngredientDTO(ingredient);
    });

    it('should have a prop for each ingredient getter', () => {
      const ingredientGetters: string[] = getGetters(ingredient);

      for (const getter of ingredientGetters) {
        expect(ingredientDTO).toHaveProperty(getter);
      }
    });

    it('should convert Ingredient to IngredientDTO', () => {
      expect(ingredientDTO).toEqual({
        id: ingredient.id,
        name: ingredient.name,
        nutritionalInfoPer100g: ingredient.nutritionalInfoPer100g,
        imageUrl: ingredient.imageUrl,
        createdAt: ingredient.createdAt.toISOString(),
        updatedAt: ingredient.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof ingredientDTO.createdAt).toBe('string');
      expect(typeof ingredientDTO.updatedAt).toBe('string');
      expect(ingredientDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(ingredientDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle optional imageUrl', () => {
      const ingredientWithImage = Ingredient.create({
        ...vp.validIngredientProps,
        imageUrl: 'https://example.com/image.jpg',
      });

      const dto = toIngredientDTO(ingredientWithImage);
      expect(dto.imageUrl).toBe('https://example.com/image.jpg');
    });
  });

  describe('fromIngredientDTO', () => {
    beforeEach(() => {
      ingredientDTO = toIngredientDTO(ingredient);
    });

    it('should convert IngredientDTO to Ingredient', () => {
      const reconstructedIngredient = fromIngredientDTO(ingredientDTO);

      expect(reconstructedIngredient).toBeInstanceOf(Ingredient);
      expect(reconstructedIngredient.id).toBe(ingredient.id);
      expect(reconstructedIngredient.name).toBe(ingredient.name);
      expect(reconstructedIngredient.nutritionalInfoPer100g).toEqual(
        ingredient.nutritionalInfoPer100g
      );
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedIngredient = fromIngredientDTO(ingredientDTO);
      const reconvertedDTO = toIngredientDTO(reconstructedIngredient);

      expect(reconvertedDTO).toEqual(ingredientDTO);
    });

    it('should handle optional imageUrl in conversion', () => {
      const ingredientWithImage = Ingredient.create({
        ...vp.validIngredientProps,
        imageUrl: 'https://example.com/image.jpg',
      });

      const dto = toIngredientDTO(ingredientWithImage);
      const reconstructed = fromIngredientDTO(dto);

      expect(reconstructed.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should handle missing imageUrl', () => {
      const ingredientWithoutImage = Ingredient.create({
        ...vp.validIngredientProps,
        imageUrl: undefined,
      });

      const dto = toIngredientDTO(ingredientWithoutImage);
      const reconstructed = fromIngredientDTO(dto);

      expect(reconstructed.imageUrl).toBeUndefined();
    });
  });
});
