import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemIngredientLinesRepo
  extends BaseFileSystemRepo<IngredientLine>
  implements IngredientLinesRepo
{
  constructor() {
    super('ingredient-lines.json');
  }

  protected getItemId(item: IngredientLine): string {
    return item.id;
  }

  protected serializeItems(items: IngredientLine[]): IngredientLineDTO[] {
    return items.map(toIngredientLineDTO);
  }

  protected deserializeItems(data: unknown[]): IngredientLine[] {
    return (data as IngredientLineDTO[]).map((item) => {
      const ingredient = Ingredient.create({
        id: item.ingredient.id,
        name: item.ingredient.name,
        nutritionalInfoPer100g: item.ingredient.nutritionalInfoPer100g,
        createdAt: new Date(item.ingredient.createdAt),
        updatedAt: new Date(item.ingredient.updatedAt),
      });

      return IngredientLine.create({
        id: item.id,
        ingredient,
        quantityInGrams: item.quantityInGrams,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });
  }

  async saveIngredientLine(ingredientLine: IngredientLine): Promise<void> {
    return this.saveItem(ingredientLine);
  }

  async getAllIngredientLines(): Promise<IngredientLine[]> {
    return this.getAllItems();
  }

  async getIngredientLineById(id: string): Promise<IngredientLine | null> {
    return this.getItemById(id);
  }

  async getIngredientLinesByIds(ids: string[]): Promise<IngredientLine[]> {
    const allLines = await this.getAllItems();
    return allLines.filter((line) => ids.includes(line.id));
  }

  async deleteIngredientLine(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
