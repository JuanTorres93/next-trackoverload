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

  async getAllMealsForUser(userId: string): Promise<Meal[]> {
    return this.meals.filter((meal) => meal.userId === userId);
  }

  async getMealById(id: string): Promise<Meal | null> {
    const meal = this.meals.find((m) => m.id === id);
    return meal || null;
  }

  async getMealByIds(ids: string[]): Promise<Meal[]> {
    return this.meals.filter((m) => ids.includes(m.id));
  }

  async getMealByIdForUser(id: string, userId: string): Promise<Meal | null> {
    const meal = this.meals.find((m) => m.id === id && m.userId === userId);
    return meal || null;
  }

  async getMealsByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Meal[]> {
    return this.meals.filter(
      (meal) => meal.createdFromRecipeId === recipeId && meal.userId === userId
    );
  }

  async deleteMeal(id: string): Promise<void> {
    const index = this.meals.findIndex((m) => m.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.meals.splice(index, 1);
  }

  async deleteMultipleMeals(ids: string[]): Promise<void> {
    this.meals = this.meals.filter((m) => !ids.includes(m.id));
  }

  async deleteAllMealsForUser(userId: string): Promise<void> {
    this.meals = this.meals.filter((m) => m.userId !== userId);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.meals = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.meals.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): Meal[] {
    return [...this.meals];
  }
}
