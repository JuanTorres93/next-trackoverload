export type DayDTO = {
  id: string; // Date as YYYYMMDD

  day: number;
  month: number;
  year: number;

  userId: string;

  mealIds: string[];
  fakeMealIds: string[];

  userWeightInKg?: number;
  updatedCaloriesGoal?: number;
  updatedProteinGoal?: number;

  createdAt: string;
  updatedAt: string;
};
