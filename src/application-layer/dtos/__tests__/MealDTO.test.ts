import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { fromMealDTO, MealDTO, toMealDTO } from '../MealDTO';

describe('MealDTO', () => {
  let meal: Meal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let mealDTO: MealDTO;

  beforeEach(() => {
    ingredient = Ingredient.create(vp.validIngredientProps);
    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      parentType: 'meal',
      parentId: vp.mealPropsNoIngredientLines.id,
      ingredient,
    });
    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });
  });

  describe('toMealDTO', () => {
    beforeEach(() => {
      mealDTO = toMealDTO(meal);
    });

    it('should have a prop for each meal getter', () => {
      for (const getter of dto.mealDTOProperties) {
        expect(mealDTO).toHaveProperty(getter);
      }
    });

    it('should convert Meal to MealDTO', () => {
      expect(mealDTO).toEqual({
        id: meal.id,
        userId: meal.userId,
        name: meal.name,
        ingredientLines: meal.ingredientLines.map((line) => ({
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
        calories: meal.calories,
        protein: meal.protein,
        createdAt: meal.createdAt.toISOString(),
        updatedAt: meal.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof mealDTO.createdAt).toBe('string');
      expect(typeof mealDTO.updatedAt).toBe('string');
      expect(mealDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(mealDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include nested ingredient line DTOs', () => {
      expect(mealDTO.ingredientLines).toHaveLength(1);
      const ingredientLineDTO = mealDTO.ingredientLines[0];

      for (const getter of dto.ingredientLineDTOProperties) {
        expect(ingredientLineDTO).toHaveProperty(getter);
      }
    });

    it('should include nested ingredient DTOs within ingredient lines', () => {
      const ingredientLineDTO = mealDTO.ingredientLines[0];

      for (const getter of dto.ingredientDTOProperties) {
        expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
      }
    });
  });

  describe('fromMealDTO', () => {
    beforeEach(() => {
      mealDTO = toMealDTO(meal);
    });

    it('should convert MealDTO to Meal', () => {
      const reconstructedMeal = fromMealDTO(mealDTO);

      expect(reconstructedMeal).toBeInstanceOf(Meal);
    });

    it('should reconstruct nested IngredientLine entities', () => {
      const reconstructedMeal = fromMealDTO(mealDTO);

      expect(reconstructedMeal.ingredientLines).toHaveLength(1);
      expect(reconstructedMeal.ingredientLines[0]).toBeInstanceOf(
        IngredientLine
      );
    });

    it('should reconstruct nested Ingredient entities within ingredient lines', () => {
      const reconstructedMeal = fromMealDTO(mealDTO);
      const reconstructedIngredient =
        reconstructedMeal.ingredientLines[0].ingredient;

      expect(reconstructedIngredient).toBeInstanceOf(Ingredient);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedMeal = fromMealDTO(mealDTO);
      const reconvertedDTO = toMealDTO(reconstructedMeal);

      expect(reconvertedDTO).toEqual(mealDTO);
    });

    it('should handle meals with multiple ingredient lines', () => {
      const ingredientLine2 = IngredientLine.create({
        ...vp.ingredientLineRecipePropsNoIngredient,
        id: 'line-2',
        parentId: meal.id,
        parentType: 'meal',
        ingredient,
        quantityInGrams: 100,
      });

      const mealWithMultipleLines = Meal.create({
        ...vp.mealPropsNoIngredientLines,
        ingredientLines: [ingredientLine, ingredientLine2],
      });

      const dto = toMealDTO(mealWithMultipleLines);
      const reconstructed = fromMealDTO(dto);

      expect(reconstructed.ingredientLines).toHaveLength(2);
      expect(reconstructed.ingredientLines[0].id).toBe(ingredientLine.id);
      expect(reconstructed.ingredientLines[1].id).toBe(ingredientLine2.id);
    });
  });
});
