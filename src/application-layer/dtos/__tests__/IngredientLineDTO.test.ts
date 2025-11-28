import { beforeEach, describe, expect, it } from 'vitest';
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
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });
  });

  describe('toIngredientLineDTO', () => {
    beforeEach(() => {
      ingredientLineDTO = toIngredientLineDTO(ingredientLine);
    });

    it('should convert IngredientLine to IngredientLineDTO', () => {
      expect(ingredientLineDTO).toEqual({
        id: ingredientLine.id,
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

    it('should have all required properties', () => {
      expect(ingredientLineDTO).toHaveProperty('id');
      expect(ingredientLineDTO).toHaveProperty('ingredient');
      expect(ingredientLineDTO).toHaveProperty('quantityInGrams');
      expect(ingredientLineDTO).toHaveProperty('calories');
      expect(ingredientLineDTO).toHaveProperty('protein');
      expect(ingredientLineDTO).toHaveProperty('createdAt');
      expect(ingredientLineDTO).toHaveProperty('updatedAt');
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof ingredientLineDTO.createdAt).toBe('string');
      expect(typeof ingredientLineDTO.updatedAt).toBe('string');
      expect(() => new Date(ingredientLineDTO.createdAt)).not.toThrow();
      expect(() => new Date(ingredientLineDTO.updatedAt)).not.toThrow();
    });

    it('should include nested ingredient DTO', () => {
      expect(ingredientLineDTO.ingredient).toHaveProperty('id');
      expect(ingredientLineDTO.ingredient).toHaveProperty('name');
      expect(ingredientLineDTO.ingredient).toHaveProperty(
        'nutritionalInfoPer100g'
      );
      expect(ingredientLineDTO.ingredient).toHaveProperty('createdAt');
      expect(ingredientLineDTO.ingredient).toHaveProperty('updatedAt');
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
      expect(reconstructedIngredientLine.id).toBe(ingredientLine.id);
      expect(reconstructedIngredientLine.quantityInGrams).toBe(
        ingredientLine.quantityInGrams
      );
      expect(reconstructedIngredientLine.calories).toBe(
        ingredientLine.calories
      );
      expect(reconstructedIngredientLine.protein).toBe(ingredientLine.protein);
    });

    it('should convert ISO 8601 strings back to Date objects', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);

      expect(reconstructedIngredientLine.createdAt).toBeInstanceOf(Date);
      expect(reconstructedIngredientLine.updatedAt).toBeInstanceOf(Date);
      expect(reconstructedIngredientLine.createdAt.getTime()).toBe(
        ingredientLine.createdAt.getTime()
      );
      expect(reconstructedIngredientLine.updatedAt.getTime()).toBe(
        ingredientLine.updatedAt.getTime()
      );
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

    it('should calculate calories correctly on reconstructed entity', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);

      // 100 cal per 100g * 200g = 200 cal
      expect(reconstructedIngredientLine.calories).toBe(200);
    });

    it('should calculate protein correctly on reconstructed entity', () => {
      const reconstructedIngredientLine =
        fromIngredientLineDTO(ingredientLineDTO);

      // 15 protein per 100g * 200g = 30 protein
      expect(reconstructedIngredientLine.protein).toBe(30);
    });

    it('should handle ingredient lines with optional imageUrl', () => {
      const ingredientWithImage = Ingredient.create({
        ...vp.validIngredientProps,
        imageUrl: 'https://example.com/image.jpg',
      });

      const ingredientLineWithImage = IngredientLine.create({
        ...vp.ingredientLinePropsNoIngredient,
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
