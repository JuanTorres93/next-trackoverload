import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { NotFoundError } from '@/domain/common/errors';

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
    if (index === -1)
      throw new NotFoundError('MemoryMealsRepo: Meal not found');

    this.meals.splice(index, 1);
  }
}
