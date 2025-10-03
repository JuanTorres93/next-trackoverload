import { FakeMeal } from '../entities/fakemeal/FakeMeal';

export interface FakeMealsRepo {
  getAllFakeMeals(): Promise<FakeMeal[]>;
  getFakeMealById(id: string): Promise<FakeMeal | null>;
  saveFakeMeal(fakeMeal: FakeMeal): Promise<void>;
  deleteFakeMeal(id: string): Promise<void>;
}
