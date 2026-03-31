import { DayDTO } from "./DayDTO";
import { FakeMealDTO } from "./FakeMealDTO";
import { MealDTO } from "./MealDTO";

type AssembledDayDTOData = DayDTO & {
  meals: MealDTO[];
  fakeMeals: FakeMealDTO[];
};

export class AssembledDayDTO implements DayDTO {
  id!: string;
  userId!: string;
  mealIds!: string[];
  fakeMealIds!: string[];
  createdAt!: string;
  userWeightInKg?: number;
  updatedCaloriesGoal?: number;
  day!: number;
  month!: number;
  year!: number;
  updatedAt!: string;
  meals!: MealDTO[];
  fakeMeals!: FakeMealDTO[];

  constructor(data: AssembledDayDTOData) {
    Object.assign(this, data);
  }

  totalCalories(): number {
    return (
      this.meals.reduce((total, meal) => total + meal.calories, 0) +
      this.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.calories, 0)
    );
  }

  totalProtein(): number {
    return (
      this.meals.reduce((total, meal) => total + meal.protein, 0) +
      this.fakeMeals.reduce((total, fakeMeal) => total + fakeMeal.protein, 0)
    );
  }

  isToday() {
    const today = new Date();

    return (
      today.getDate() === this.day &&
      today.getMonth() + 1 === this.month &&
      today.getFullYear() === this.year
    );
  }

  isPast() {
    const today = new Date();
    const dayDate = new Date(this.year, this.month - 1, this.day);

    return dayDate < today;
  }
}

export function toAssembledDayDTO(data: AssembledDayDTOData): AssembledDayDTO {
  return new AssembledDayDTO(data);
}
