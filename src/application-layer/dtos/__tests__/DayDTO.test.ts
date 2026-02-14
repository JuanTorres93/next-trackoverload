import * as dayTestProps from '../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../tests/createProps/fakeMealTestProps';
import * as mealTestProps from '../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../tests/createProps/ingredientTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { DayDTO, fromDayDTO, toDayDTO } from '../DayDTO';

describe('DayDTO', () => {
  let day: Day;
  let meal: Meal;
  let fakeMeal: FakeMeal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let dayDTO: DayDTO;

  beforeEach(() => {
    ingredient = ingredientTestProps.createTestIngredient();

    ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      parentType: 'meal',
      parentId: mealTestProps.mealPropsNoIngredientLines.id,
      ingredient,
    });
    meal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });
    fakeMeal = FakeMeal.create(fakeMealTestProps.validFakeMealProps);

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    day.addMeal(meal.id);
    day.addFakeMeal(fakeMeal.id);
  });

  describe('toDayDTO', () => {
    beforeEach(() => {
      dayDTO = toDayDTO(day);
    });

    it('should have a prop for each day getter', () => {
      for (const getter of dto.dayDTOProperties) {
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
      const { updatedAt, ...reconvertedDTO } = toDayDTO(reconstructedDay);

      const { updatedAt: originalUpdatedAt, ...originalDTO } = dayDTO;

      expect(reconvertedDTO).toEqual(originalDTO);
      // Expect updatedAt to be close enough (within 1 second)
      expect(
        Math.abs(
          new Date(updatedAt).getTime() - new Date(originalUpdatedAt).getTime(),
        ),
      ).toBeLessThanOrEqual(1000);
    });

    it('should correctly parse day, month, year from id', () => {
      const reconstructedDay = fromDayDTO(dayDTO);

      expect(reconstructedDay.day).toBe(day.day);
      expect(reconstructedDay.month).toBe(day.month);
      expect(reconstructedDay.year).toBe(day.year);
    });
  });
});
