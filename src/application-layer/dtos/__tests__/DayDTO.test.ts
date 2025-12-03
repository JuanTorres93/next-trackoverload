import { getGetters } from './_getGettersUtil';
import { toDayDTO, fromDayDTO, DayDTO } from '../DayDTO';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import * as vp from '@/../tests/createProps';

describe('DayDTO', () => {
  let day: Day;
  let meal: Meal;
  let fakeMeal: FakeMeal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let dayDTO: DayDTO;

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
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);

    day = Day.create({
      ...vp.validDayProps(),
      meals: [meal, fakeMeal],
    });
  });

  describe('toDayDTO', () => {
    beforeEach(() => {
      dayDTO = toDayDTO(day);
    });

    it('should have a prop for each day getter', () => {
      const dayGetters: string[] = getGetters(day);

      for (const getter of dayGetters) {
        expect(dayDTO).toHaveProperty(getter);
      }
    });

    it('should convert Day to DayDTO', () => {
      expect(dayDTO).toEqual({
        id: day.id,
        userId: day.userId,
        meals: expect.any(Array),
        calories: day.calories,
        protein: day.protein,
        day: day.day,
        month: day.month,
        year: day.year,
        createdAt: day.createdAt.toISOString(),
        updatedAt: day.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof dayDTO.createdAt).toBe('string');
      expect(typeof dayDTO.updatedAt).toBe('string');
      expect(dayDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(dayDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include nested meal DTOs', () => {
      expect(dayDTO.meals).toHaveLength(2);
      const mealDTO = dayDTO.meals[0];

      const mealGetters = getGetters(meal);
      for (const getter of mealGetters) {
        expect(mealDTO).toHaveProperty(getter);
      }
    });

    it('should include nested fake meal DTOs', () => {
      const fakeMealDTO = dayDTO.meals[1];

      const fakeMealGetters = getGetters(fakeMeal);
      for (const getter of fakeMealGetters) {
        expect(fakeMealDTO).toHaveProperty(getter);
      }
    });

    it('should include nested ingredient line DTOs within meals', () => {
      const mealDTO = dayDTO.meals[0];

      if ('ingredientLines' in mealDTO) {
        expect(mealDTO.ingredientLines).toHaveLength(1);
        const ingredientLineDTO = mealDTO.ingredientLines[0];

        const ingredientLineGetters = getGetters(ingredientLine);
        for (const getter of ingredientLineGetters) {
          expect(ingredientLineDTO).toHaveProperty(getter);
        }
      }
    });

    it('should include nested ingredient DTOs within ingredient lines', () => {
      const mealDTO = dayDTO.meals[0];

      if ('ingredientLines' in mealDTO) {
        const ingredientLineDTO = mealDTO.ingredientLines[0];
        const ingredientGetters = getGetters(ingredient);

        for (const getter of ingredientGetters) {
          expect(ingredientLineDTO.ingredient).toHaveProperty(getter);
        }
      }
    });

    it('should handle day with only meals', () => {
      const dayWithOnlyMeals = Day.create({
        ...vp.validDayProps(),
        meals: [meal],
      });

      const dto = toDayDTO(dayWithOnlyMeals);
      expect(dto.meals).toHaveLength(1);
      expect(dto.meals[0]).toHaveProperty('ingredientLines');
    });

    it('should handle day with only fake meals', () => {
      const dayWithOnlyFakeMeals = Day.create({
        ...vp.validDayProps(),
        meals: [fakeMeal],
      });

      const dto = toDayDTO(dayWithOnlyFakeMeals);
      expect(dto.meals).toHaveLength(1);
      expect(dto.meals[0]).not.toHaveProperty('ingredientLines');
    });
  });

  describe('fromDayDTO', () => {
    beforeEach(() => {
      dayDTO = toDayDTO(day);
    });

    it('should convert DayDTO to Day', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay).toBeInstanceOf(Day);
    });

    it('should reconstruct nested Meal entities', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay.meals).toHaveLength(2);
      expect(reconstructedDay.meals[0]).toBeInstanceOf(Meal);
    });

    it('should reconstruct nested FakeMeal entities', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay.meals[1]).toBeInstanceOf(FakeMeal);
    });

    it('should reconstruct nested IngredientLine entities within meals', () => {
      const reconstructedDay = fromDayDTO(dayDTO);
      const reconstructedMeal = reconstructedDay.meals[0] as Meal;

      expect(reconstructedMeal.ingredientLines).toHaveLength(1);
      expect(reconstructedMeal.ingredientLines[0]).toBeInstanceOf(
        IngredientLine
      );
    });

    it('should reconstruct nested Ingredient entities', () => {
      const reconstructedDay = fromDayDTO(dayDTO);
      const reconstructedMeal = reconstructedDay.meals[0] as Meal;
      const reconstructedIngredient =
        reconstructedMeal.ingredientLines[0].ingredient;

      expect(reconstructedIngredient).toBeInstanceOf(Ingredient);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedDay = fromDayDTO(dayDTO);
      const reconvertedDTO = toDayDTO(reconstructedDay);

      expect(reconvertedDTO).toEqual(dayDTO);
    });

    it('should handle day with only meals', () => {
      const dayWithOnlyMeals = Day.create({
        ...vp.validDayProps(),
        meals: [meal],
      });

      const dto = toDayDTO(dayWithOnlyMeals);
      const reconstructed = fromDayDTO(dto);

      expect(reconstructed.meals).toHaveLength(1);
      expect(reconstructed.meals[0]).toBeInstanceOf(Meal);
    });

    it('should handle day with only fake meals', () => {
      const dayWithOnlyFakeMeals = Day.create({
        ...vp.validDayProps(),
        meals: [fakeMeal],
      });

      const dto = toDayDTO(dayWithOnlyFakeMeals);
      const reconstructed = fromDayDTO(dto);

      expect(reconstructed.meals).toHaveLength(1);
      expect(reconstructed.meals[0]).toBeInstanceOf(FakeMeal);
    });

    it('should correctly parse day, month, year from id', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay.day).toBe(day.day);
      expect(reconstructedDay.month).toBe(day.month);
      expect(reconstructedDay.year).toBe(day.year);
    });

    it('should handle days with multiple meals of different types', () => {
      const meal2 = Meal.create({
        ...vp.mealPropsNoIngredientLines,
        id: 'meal-2',
        ingredientLines: [ingredientLine],
      });

      const fakeMeal2 = FakeMeal.create({
        ...vp.validFakeMealProps,
        id: 'fakemeal-2',
      });

      const complexDay = Day.create({
        ...vp.validDayProps(),
        meals: [meal, fakeMeal, meal2, fakeMeal2],
      });

      const dto = toDayDTO(complexDay);
      const reconstructed = fromDayDTO(dto);

      expect(reconstructed.meals).toHaveLength(4);
      expect(reconstructed.meals[0]).toBeInstanceOf(Meal);
      expect(reconstructed.meals[1]).toBeInstanceOf(FakeMeal);
      expect(reconstructed.meals[2]).toBeInstanceOf(Meal);
      expect(reconstructed.meals[3]).toBeInstanceOf(FakeMeal);
    });
  });
});
