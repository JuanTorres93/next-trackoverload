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
    });

    day.addMeal(meal.id);
    day.addFakeMeal(fakeMeal.id);
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
        mealIds: [...day.mealIds],
        fakeMealIds: [...day.fakeMealIds],
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
  });

  describe('fromDayDTO', () => {
    beforeEach(() => {
      dayDTO = toDayDTO(day);
    });

    it('should convert DayDTO to Day', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay).toBeInstanceOf(Day);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedDay = fromDayDTO(dayDTO);
      const reconvertedDTO = toDayDTO(reconstructedDay);

      expect(reconvertedDTO).toEqual(dayDTO);
    });

    it('should correctly parse day, month, year from id', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay.day).toBe(day.day);
      expect(reconstructedDay.month).toBe(day.month);
      expect(reconstructedDay.year).toBe(day.year);
    });
  });
});
