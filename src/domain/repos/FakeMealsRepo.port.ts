import { FakeMeal, FakeUpdateProps } from '../fakemeal/FakeMeal';

export interface FakeMealsRepo {
  getAllFakeMeals(): Promise<FakeMeal[]>;
  getFakeMealById(id: string): Promise<FakeMeal | null>;
  saveFakeMeal(fakeMeal: FakeMeal): Promise<void>;
  deleteFakeMeal(id: string): Promise<void>;
  updateFakeMeal(id: string, patch: FakeUpdateProps): Promise<FakeMeal>;
}
