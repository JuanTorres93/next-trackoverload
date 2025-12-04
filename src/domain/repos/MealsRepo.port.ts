import { Meal } from '../entities/meal/Meal';

export interface MealsRepo {
  getAllMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  getMealByIds(ids: string[]): Promise<Meal[]>;
  getAllMealsForUser(userId: string): Promise<Meal[]>;
  getMealByIdForUser(id: string, userId: string): Promise<Meal | null>;
  saveMeal(meal: Meal): Promise<void>;
  deleteMeal(id: string): Promise<void>;
  deleteMultipleMeals(ids: string[]): Promise<void>;
}
