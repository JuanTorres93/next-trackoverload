import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { NotFoundError } from '@/domain/common/errors';

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
    if (index === -1)
      throw new NotFoundError('MemoryIngredientsRepo: Ingredient not found');

    this.ingredients.splice(index, 1);
  }
}
