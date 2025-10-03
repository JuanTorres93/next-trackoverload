import { Meal } from '../entities/meal/Meal';

export interface MealsRepo {
  getAllMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  saveMeal(meal: Meal): Promise<void>;
  deleteMeal(id: string): Promise<void>;
}
