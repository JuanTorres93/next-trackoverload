export type DayDTO = {
  id: string; // Date as YYYYMMDD
  userId: string;
  mealIds: string[];
  fakeMealIds: string[];
  createdAt: string;
  userWeightInKg?: number;
  updatedCaloriesGoal?: number;
  day: number;
  month: number;
  year: number;
  updatedAt: string;
};
