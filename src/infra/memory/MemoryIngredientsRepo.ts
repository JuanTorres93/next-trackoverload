import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';

export class MemoryIngredientsRepo implements IngredientsRepo {
  private ingredients: Ingredient[] = [];

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    const existingIndex = this.ingredients.findIndex(
      (ing) => ing.id === ingredient.id
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

  async deleteIngredient(id: string): Promise<void> {
    const index = this.ingredients.findIndex((ing) => ing.id === id);
    // Validation is done in the use case to avoid false positives when using a real repo
    if (index === -1) return Promise.reject(null);

    this.ingredients.splice(index, 1);
  }

  async getByFuzzyName(name: string): Promise<Ingredient[]> {
    const searchTerm = name.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    return this.ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm)
    );
  }
}
