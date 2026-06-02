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

export type AssembledDayDTOProps = DayDTO & {
  meals: MealDTO[];
  fakeMeals: FakeMealDTO[];
};
