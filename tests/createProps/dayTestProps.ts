import { AssembledDayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { toFakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import { toMealDTO } from '@/application-layer/dtos/MealDTO';
import { Day, DayCreateProps } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { createTestFakeMeal } from './fakeMealTestProps';
import { createTestMeal } from './mealTestProps';
import { userId } from './userTestProps';

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
  const meal = createTestMeal();
  const fakeMeal = createTestFakeMeal();

  const dayProps = validDayProps();
  const day = Day.create(dayProps);

  day.addMeal(meal.id);
  day.addFakeMeal(fakeMeal.id);

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

export function createEmptyTestDay(props?: Partial<DayCreateProps>): Day {
  return Day.create({
    day: props?.day || dateId.getDate(),
    month: props?.month || dateId.getMonth() + 1,
    year: props?.year || dateId.getFullYear(),
    userId: props?.userId || userId,
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date(),
  });
}
