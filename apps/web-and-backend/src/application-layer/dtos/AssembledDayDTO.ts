import { AssembledDayDTO, AssembledDayDTOProps } from "shared";

export function toAssembledDayDTO(data: AssembledDayDTOProps): AssembledDayDTO {
  return {
    ...data,
    totalCalories: computeTotalCalories(data),
    totalProtein: computeTotalProtein(data),
    isToday: computeIsToday(data),
    isPast: computeIsPast(data),
  };
}

function computeTotalCalories(data: AssembledDayDTOProps): number {
  return (
    data.meals.reduce((total, meal) => total + meal.calories, 0) +
    data.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.calories, 0)
  );
}

function computeTotalProtein(data: AssembledDayDTOProps): number {
  return (
    data.meals.reduce((total, meal) => total + meal.protein, 0) +
    data.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.protein, 0)
  );
}

function computeIsToday(data: AssembledDayDTOProps): boolean {
  const today = new Date();
  return (
    today.getDate() === data.day &&
    today.getMonth() + 1 === data.month &&
    today.getFullYear() === data.year
  );
}

function computeIsPast(data: AssembledDayDTOProps): boolean {
  const today = new Date();
  const dayDate = new Date(data.year, data.month - 1, data.day);
  return dayDate < today;
}
