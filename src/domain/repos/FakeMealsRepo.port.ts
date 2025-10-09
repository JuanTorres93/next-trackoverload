import { FakeMeal } from '../entities/fakemeal/FakeMeal';

export interface FakeMealsRepo {
  getAllFakeMeals(): Promise<FakeMeal[]>;
  getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]>;
  getFakeMealById(id: string): Promise<FakeMeal | null>;
  getFakeMealByIdAndUserId(
    id: string,
    userId: string
  ): Promise<FakeMeal | null>;
  saveFakeMeal(fakeMeal: FakeMeal): Promise<void>;
  deleteFakeMeal(id: string): Promise<void>;
  deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void>;
}
