import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';

export class MemoryIngredientsRepo implements IngredientsRepo {
  private ingredients: Ingredient[] = [];

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    const existingIndex = this.ingredients.findIndex(
      (ing) => ing.id === ingredient.id,
    );

    if (existingIndex !== -1) {
      this.ingredients[existingIndex] = ingredient;
    } else {
      this.ingredients.push(ingredient);
    }
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return [...this.ingredients];
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const ingredient = this.ingredients.find((ing) => ing.id === id);
    return ingredient || null;
  }

  async getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
    return this.ingredients.filter((ingredient) => ids.includes(ingredient.id));
  }

  async deleteIngredient(id: string): Promise<void> {
    const index = this.ingredients.findIndex((ing) => ing.id === id);
    // Validation is done in the use case to avoid false positives when using a real repo
    if (index === -1) return Promise.reject(null);

    this.ingredients.splice(index, 1);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.ingredients = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.ingredients.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): Ingredient[] {
    return [...this.ingredients];
  }
}
