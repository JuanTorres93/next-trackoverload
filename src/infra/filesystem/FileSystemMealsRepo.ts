import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemMealsRepo
  extends BaseFileSystemRepo<Meal>
  implements MealsRepo
{
  constructor() {
    super('meals.json');
  }

  protected getItemId(item: Meal): string {
    return item.id;
  }

  protected serializeItems(items: Meal[]): MealDTO[] {
    return items.map(toMealDTO);
  }

  protected deserializeItems(data: unknown[]): Meal[] {
    return (data as MealDTO[]).map((item) => {
      const ingredientLines = item.ingredientLines.map(
        (lineData: IngredientLineDTO) => {
          const ingredient = Ingredient.create({
            id: lineData.ingredient.id,
            name: lineData.ingredient.name,
            nutritionalInfoPer100g: lineData.ingredient.nutritionalInfoPer100g,
            createdAt: new Date(lineData.ingredient.createdAt),
            updatedAt: new Date(lineData.ingredient.updatedAt),
          });

          return IngredientLine.create({
            id: lineData.id,
            ingredient,
            quantityInGrams: lineData.quantityInGrams,
            createdAt: new Date(lineData.createdAt),
            updatedAt: new Date(lineData.updatedAt),
          });
        }
      );

      return Meal.create({
        id: item.id,
        userId: item.userId,
        name: item.name,
        ingredientLines,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });
  }

  async saveMeal(meal: Meal): Promise<void> {
    return this.saveItem(meal);
  }

  async getAllMeals(): Promise<Meal[]> {
    return this.getAllItems();
  }

  async getMealById(id: string): Promise<Meal | null> {
    return this.getItemById(id);
  }

  async getAllMealsForUser(userId: string): Promise<Meal[]> {
    const meals = await this.getAllItems();
    return meals.filter((meal) => meal.userId === userId);
  }

  async getMealByIdForUser(id: string, userId: string): Promise<Meal | null> {
    const meal = await this.getItemById(id);
    return meal && meal.userId === userId ? meal : null;
  }

  async deleteMeal(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
