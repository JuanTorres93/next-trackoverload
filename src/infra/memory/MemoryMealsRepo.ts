import { Meal } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export class MemoryMealsRepo implements MealsRepo {
  private meals: Meal[] = [];

  async saveMeal(meal: Meal): Promise<void> {
    const existingIndex = this.meals.findIndex((m) => m.id === meal.id);

    if (existingIndex !== -1) {
      this.meals[existingIndex] = meal;
    } else {
      this.meals.push(meal);
    }
  }

  async getAllMeals(): Promise<Meal[]> {
    return [...this.meals];
  }

  async getMealById(id: string): Promise<Meal | null> {
    const meal = this.meals.find((m) => m.id === id);
    return meal || null;
  }

  async deleteMeal(id: string): Promise<void> {
    const index = this.meals.findIndex((m) => m.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.meals.splice(index, 1);
  }
}
