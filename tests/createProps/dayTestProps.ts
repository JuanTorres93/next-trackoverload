import { Day } from '@/domain/entities/day/Day';
import { validFakeMealProps } from './fakeMealTestProps';
import { validMealWithIngredientLines } from './mealTestProps';
import { userId } from './userTestProps';
import { AssembledDayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { toMealDTO } from '@/application-layer/dtos/MealDTO';
import { toFakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';

export const dateId = new Date('2023-10-01');

export function validDayProps() {
  return {
    day: 1,
    month: 10,
    year: 2023,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function getValidAssembledDayDTO(): {
  assembledDayDTO: AssembledDayDTO;
  meal: Meal;
  fakeMeal: FakeMeal;
} {
  const dayProps = validDayProps();
  const mealProps = validMealWithIngredientLines();
  const fakeMealProps = { ...validFakeMealProps };

  const day = Day.create(dayProps);
  day.addMeal(mealProps.id);
  day.addFakeMeal(fakeMealProps.id);

  const meal = Meal.create(mealProps);
  const fakeMeal = FakeMeal.create(fakeMealProps);

  const mealDTO = toMealDTO(meal);
  const fakeMealDTO = toFakeMealDTO(fakeMeal);

  const dayDTO = toDayDTO(day);
  const assembledDayDTO: AssembledDayDTO = {
    ...dayDTO,
    meals: [mealDTO],
    fakeMeals: [fakeMealDTO],
  };

  return {
    assembledDayDTO,
    meal,
    fakeMeal,
  };
}
