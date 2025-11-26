import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { Id } from '@/domain/types/Id/Id';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemRecipesRepo
  extends BaseFileSystemRepo<Recipe>
  implements RecipesRepo
{
  constructor() {
    super('recipes.json');
  }

  protected getItemId(item: Recipe): string {
    return item.id;
  }

  protected serializeItems(items: Recipe[]): RecipeDTO[] {
    return items.map(toRecipeDTO);
  }

  protected deserializeItems(data: unknown[]): Recipe[] {
    return (data as RecipeDTO[]).map((item) => {
      const ingredientLines = item.ingredientLines.map(
        (lineData: IngredientLineDTO) => {
          const ingredient = Ingredient.create({
            ...lineData.ingredient,
            id: Id.create(lineData.ingredient.id),
            createdAt: new Date(lineData.ingredient.createdAt),
            updatedAt: new Date(lineData.ingredient.updatedAt),
          });

          return IngredientLine.create({
            ...lineData,
            id: Id.create(lineData.id),
            ingredient,
            createdAt: new Date(lineData.createdAt),
            updatedAt: new Date(lineData.updatedAt),
          });
        }
      );

      return Recipe.create({
        ...item,
        ingredientLines,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    return this.saveItem(recipe);
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return this.getAllItems();
  }

  async getAllRecipesByUserId(userId: string): Promise<Recipe[]> {
    const recipes = await this.getAllItems();
    return recipes.filter((recipe) => recipe.userId === userId);
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return this.getItemById(id);
  }

  async getRecipeByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Recipe | null> {
    const recipe = await this.getItemById(id);
    return recipe && recipe.userId === userId ? recipe : null;
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
