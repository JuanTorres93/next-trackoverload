import { DayDTO } from "./DayDTO";
import { FakeMealDTO } from "./FakeMealDTO";
import { MealDTO } from "./MealDTO";

export type AssembledDayDTO = DayDTO & {
  meals: MealDTO[];
  fakeMeals: FakeMealDTO[];
  totalCalories: number;
  totalProtein: number;
  isToday: boolean;
  isPast: boolean;
};

export function toAssembledDayDTO(data: AssembledDayDTO): AssembledDayDTO {
  return {
    ...data,
    totalCalories: computeTotalCalories(data),
    totalProtein: computeTotalProtein(data),
    isToday: computeIsToday(data),
    isPast: computeIsPast(data),
  };
}

function computeTotalCalories(data: AssembledDayDTO): number {
  return (
    data.meals.reduce((total, meal) => total + meal.calories, 0) +
    data.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.calories, 0)
  );
}

function computeTotalProtein(data: AssembledDayDTO): number {
  return (
    data.meals.reduce((total, meal) => total + meal.protein, 0) +
    data.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.protein, 0)
  );
}

function computeIsToday(data: AssembledDayDTO): boolean {
  const today = new Date();
  return (
    today.getDate() === data.day &&
    today.getMonth() + 1 === data.month &&
    today.getFullYear() === data.year
  );
}

function computeIsPast(data: AssembledDayDTO): boolean {
  const today = new Date();
  const dayDate = new Date(data.year, data.month - 1, data.day);
  return dayDate < today;
}
