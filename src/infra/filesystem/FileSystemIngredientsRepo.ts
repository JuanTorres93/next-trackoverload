import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemIngredientsRepo
  extends BaseFileSystemRepo<Ingredient>
  implements IngredientsRepo
{
  constructor() {
    super('ingredients.json');
  }

  protected getItemId(item: Ingredient): string {
    return item.id;
  }

  protected serializeItems(items: Ingredient[]): IngredientDTO[] {
    return items.map(toIngredientDTO);
  }

  protected deserializeItems(data: unknown[]): Ingredient[] {
    return (data as IngredientDTO[]).map((item) =>
      Ingredient.create({
        id: item.id,
        name: item.name,
        nutritionalInfoPer100g: item.nutritionalInfoPer100g,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
    );
  }

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    return this.saveItem(ingredient);
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return this.getAllItems();
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    return this.getItemById(id);
  }

  async deleteIngredient(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
