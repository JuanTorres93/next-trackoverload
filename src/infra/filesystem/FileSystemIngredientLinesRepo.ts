import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Meal } from '@/domain/entities/meal/Meal';
import { Id } from '@/domain/types/Id/Id';
import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';
import { FileSystemRecipesRepo } from './FileSystemRecipesRepo';
import { FileSystemMealsRepo } from './FileSystemMealsRepo';

export class FileSystemIngredientLinesRepo
  extends BaseFileSystemRepo<IngredientLine>
  implements IngredientLinesRepo
{
  private recipesRepo: FileSystemRecipesRepo;
  private mealsRepo: FileSystemMealsRepo;

  constructor() {
    super('ingredient-lines.json');
    this.recipesRepo = new FileSystemRecipesRepo();
    this.mealsRepo = new FileSystemMealsRepo();
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
        ...item.ingredient,
        id: Id.create(item.ingredient.id),
        createdAt: new Date(item.ingredient.createdAt),
        updatedAt: new Date(item.ingredient.updatedAt),
      });

      return IngredientLine.create({
        ...item,
        ingredient,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });
  }

  async saveIngredientLine(ingredientLine: IngredientLine): Promise<void> {
    // Save the ingredient line itself
    await this.saveItem(ingredientLine);

    // Update all recipes that contain this ingredient line
    await this.updateRecipesWithIngredientLine(ingredientLine);
    // Update all meals that contain this ingredient line
    await this.updateMealsWithIngredientLine(ingredientLine);
  }

  private async updateRecipesWithIngredientLine(
    ingredientLine: IngredientLine
  ): Promise<void> {
    const allRecipes = await this.recipesRepo.getAllRecipes();
    const recipesToUpdate: Recipe[] = [];

    for (const recipe of allRecipes) {
      const hasIngredientLine = recipe.ingredientLines.some(
        (line) => line.id === ingredientLine.id
      );

      if (hasIngredientLine) {
        const updatedRecipe = Recipe.create({
          id: recipe.id,
          userId: recipe.userId,
          name: recipe.name,
          imageUrl: recipe.imageUrl,
          ingredientLines: recipe.ingredientLines.map((line) =>
            line.id === ingredientLine.id ? ingredientLine : line
          ),
          createdAt: recipe.createdAt,
          updatedAt: new Date(),
        });
        recipesToUpdate.push(updatedRecipe);
      }
    }

    // Save all updated recipes
    for (const recipe of recipesToUpdate) {
      await this.recipesRepo.saveRecipe(recipe);
    }
  }

  private async updateMealsWithIngredientLine(
    ingredientLine: IngredientLine
  ): Promise<void> {
    const allMeals = await this.mealsRepo.getAllMeals();
    const mealsToUpdate: Meal[] = [];

    for (const meal of allMeals) {
      const hasIngredientLine = meal.ingredientLines.some(
        (line) => line.id === ingredientLine.id
      );
      if (hasIngredientLine) {
        const updatedMeal = Meal.create({
          id: meal.id,
          userId: meal.userId,
          name: meal.name,
          ingredientLines: meal.ingredientLines.map((line) =>
            line.id === ingredientLine.id ? ingredientLine : line
          ),
          createdAt: meal.createdAt,
          updatedAt: new Date(),
        });
        mealsToUpdate.push(updatedMeal);
      }
    }

    // Save all updated meals
    for (const meal of mealsToUpdate) {
      await this.mealsRepo.saveMeal(meal);
    }
  }

  async saveMultipleIngredientLines(
    ingredientLines: IngredientLine[]
  ): Promise<void> {
    // Save all ingredient lines individually to trigger updates
    for (const ingredientLine of ingredientLines) {
      await this.saveIngredientLine(ingredientLine);
    }
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

  async deleteMultipleIngredientLines(ids: string[]): Promise<void> {
    return this.deleteMultipleItems(ids);
  }
}
