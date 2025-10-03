import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { NotFoundError } from '@/domain/common/errors';

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

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    const fakeMeal = this.fakeMeals.find((fm) => fm.id === id);
    return fakeMeal || null;
  }

  async deleteFakeMeal(id: string): Promise<void> {
    const index = this.fakeMeals.findIndex((fm) => fm.id === id);
    if (index === -1)
      throw new NotFoundError('MemoryFakeMealsRepo: FakeMeal not found');

    this.fakeMeals.splice(index, 1);
  }
}
