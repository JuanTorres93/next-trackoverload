import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

export class MemoryFakeMealsRepo implements FakeMealsRepo {
  private fakeMeals: FakeMeal[] = [];

  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    const existingIndex = this.fakeMeals.findIndex(
      (fm) => fm.id === fakeMeal.id
    );

    if (existingIndex !== -1) {
      this.fakeMeals[existingIndex] = fakeMeal;
    } else {
      this.fakeMeals.push(fakeMeal);
    }
  }

  async getAllFakeMeals(): Promise<FakeMeal[]> {
    return [...this.fakeMeals];
  }

  async getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]> {
    return this.fakeMeals.filter((fm) => fm.userId === userId);
  }

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    const fakeMeal = this.fakeMeals.find((fm) => fm.id === id);
    return fakeMeal || null;
  }

  async getFakeMealByIdAndUserId(
    id: string,
    userId: string
  ): Promise<FakeMeal | null> {
    const fakeMeal = this.fakeMeals.find(
      (fm) => fm.id === id && fm.userId === userId
    );
    return fakeMeal || null;
  }

  async deleteFakeMeal(id: string): Promise<void> {
    const index = this.fakeMeals.findIndex((fm) => fm.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.fakeMeals.splice(index, 1);
  }

  async deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void> {
    const index = this.fakeMeals.findIndex(
      (fm) => fm.id === id && fm.userId === userId
    );
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.fakeMeals.splice(index, 1);
  }
}
