import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

export class MemoryIngredientLinesRepo implements IngredientLinesRepo {
  private ingredientLines: IngredientLine[] = [];

  async saveIngredientLine(ingredientLine: IngredientLine): Promise<void> {
    const existingIndex = this.ingredientLines.findIndex(
      (line) => line.id === ingredientLine.id
    );

    if (existingIndex !== -1) {
      this.ingredientLines[existingIndex] = ingredientLine;
    } else {
      this.ingredientLines.push(ingredientLine);
    }
  }

  async saveMultipleIngredientLines(
    ingredientLines: IngredientLine[]
  ): Promise<void> {
    for (const ingredientLine of ingredientLines) {
      await this.saveIngredientLine(ingredientLine);
    }
  }

  async getAllIngredientLines(): Promise<IngredientLine[]> {
    return [...this.ingredientLines];
  }

  async getIngredientLineById(id: string): Promise<IngredientLine | null> {
    const ingredientLine = this.ingredientLines.find((line) => line.id === id);
    return ingredientLine || null;
  }

  async getIngredientLinesByIds(ids: string[]): Promise<IngredientLine[]> {
    return this.ingredientLines.filter((line) => ids.includes(line.id));
  }

  async deleteIngredientLine(id: string): Promise<void> {
    const index = this.ingredientLines.findIndex((line) => line.id === id);
    // Validation is done in the use case to avoid false positives when using a real repo
    if (index === -1) return Promise.reject(null);

    this.ingredientLines.splice(index, 1);
  }

  async deleteMultipleIngredientLines(ids: string[]): Promise<void> {
    // Create a Set for faster lookups
    const idsToDelete = new Set(ids);

    // Filter out items that should be deleted
    this.ingredientLines = this.ingredientLines.filter(
      (line) => !idsToDelete.has(line.id)
    );
  }
}
