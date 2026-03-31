import { DayDTO } from "./DayDTO";
import { FakeMealDTO } from "./FakeMealDTO";
import { MealDTO } from "./MealDTO";

// This type is used in usecases
export type AssembledDayDTO = DayDTO & {
  meals: MealDTO[];
  fakeMeals: FakeMealDTO[];
};
