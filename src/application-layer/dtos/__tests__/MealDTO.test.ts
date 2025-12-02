import { getGetters } from './_getGettersUtil';
import { toMealDTO, MealDTO } from '../MealDTO';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import * as vp from '@/../tests/createProps';

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
      const mealGetters: string[] = getGetters(meal);

      for (const getter of mealGetters) {
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

      const ingredientLineGetters = getGetters(ingredientLine);
      for (const getter of ingredientLineGetters) {
        expect(ingredientLineDTO).toHaveProperty(getter);
      }
    });

    it('should include nested ingredient DTOs within ingredient lines', () => {
      const ingredientLineDTO = mealDTO.ingredientLines[0];
      const ingredientGetters = getGetters(ingredient);

      for (const getter of ingredientGetters) {
        expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
      }
    });
  });
});
