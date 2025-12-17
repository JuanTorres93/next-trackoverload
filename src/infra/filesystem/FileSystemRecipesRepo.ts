import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import {
  fromRecipeDTO,
  RecipeDTO,
  toRecipeDTO,
} from '@/application-layer/dtos/RecipeDTO';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import fs from 'fs/promises';
import path from 'path';

export class FileSystemRecipesRepo implements RecipesRepo {
  private readonly recipesDir: string;
  private readonly ingredientLinesDir: string;

  constructor(
    recipesBaseDir: string = './data/recipes',
    ingredientLinesBaseDir: string = './data/ingredientlines'
  ) {
    this.recipesDir = recipesBaseDir;
    this.ingredientLinesDir = ingredientLinesBaseDir;
  }

  private async ensureDataDirs(): Promise<void> {
    try {
      await fs.mkdir(this.recipesDir, { recursive: true });
      await fs.mkdir(this.ingredientLinesDir, { recursive: true });
    } catch {
      // Directories might already exist
    }
  }

  private getRecipeFilePath(id: string): string {
    return path.join(this.recipesDir, `${id}.json`);
  }

  private getIngredientLineFilePath(id: string): string {
    return path.join(this.ingredientLinesDir, `${id}.json`);
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    await this.ensureDataDirs();
    const data = toRecipeDTO(recipe);
    const filePath = this.getRecipeFilePath(recipe.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save ingredient lines separately
    for (const line of recipe.ingredientLines) {
      const lineData = toIngredientLineDTO(line);
      const lineFilePath = this.getIngredientLineFilePath(line.id);
      await fs.writeFile(lineFilePath, JSON.stringify(lineData, null, 2));
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    await this.ensureDataDirs();

    try {
      const files = await fs.readdir(this.recipesDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const recipes = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.recipesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as RecipeDTO;
          return fromRecipeDTO(data);
        })
      );

      return recipes;
    } catch {
      return [];
    }
  }

  async getAllRecipesByUserId(userId: string): Promise<Recipe[]> {
    const allRecipes = await this.getAllRecipes();
    return allRecipes.filter((recipe) => recipe.userId === userId);
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const filePath = this.getRecipeFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as RecipeDTO;
      return fromRecipeDTO(data);
    } catch {
      return null;
    }
  }

  async getRecipeByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Recipe | null> {
    const recipe = await this.getRecipeById(id);
    if (recipe && recipe.userId === userId) {
      return recipe;
    }
    return null;
  }

  async deleteRecipe(id: string): Promise<void> {
    const filePath = this.getRecipeFilePath(id);

    try {
      // Get the recipe to find its ingredient lines
      const recipe = await this.getRecipeById(id);

      // Delete the recipe file
      await fs.unlink(filePath);

      // Delete associated ingredient lines
      if (recipe) {
        for (const line of recipe.ingredientLines) {
          const lineFilePath = this.getIngredientLineFilePath(line.id);
          try {
            await fs.unlink(lineFilePath);
          } catch {
            // Line file might not exist
          }
        }
      }
    } catch {
      // File might not exist, consistent with memory repo
    }
  }

  async deleteIngredientLineInRecipe(
    id: string,
    ingredientLineId: string
  ): Promise<void> {
    const recipe = await this.getRecipeById(id);
    if (!recipe) return;

    // Remove the ingredient line from the recipe
    const lineToRemove = recipe.ingredientLines.find(
      (line) => line.id === ingredientLineId
    );
    if (!lineToRemove) return;

    // Use the recipe's own method to remove the ingredient line
    recipe.removeIngredientLineByIngredientId(lineToRemove.ingredient.id);

    // Save the updated recipe
    await this.saveRecipe(recipe);

    // Delete the ingredient line file
    const lineFilePath = this.getIngredientLineFilePath(ingredientLineId);
    try {
      await fs.unlink(lineFilePath);
    } catch {
      // Line file might not exist
    }
  }

  async deleteMultipleIngredientLinesInRecipe(
    ids: string[],
    ingredientLineIds: string[]
  ): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.deleteIngredientLineInRecipe(ids[i], ingredientLineIds[i]);
    }
  }

  async deleteAllRecipesForUser(userId: string): Promise<void> {
    const allRecipes = await this.getAllRecipes();
    const userRecipes = allRecipes.filter((r) => r.userId === userId);

    await Promise.all(
      userRecipes.map(async (recipe) => {
        const filePath = this.getRecipeFilePath(recipe.id);
        try {
          await fs.unlink(filePath);
          // Delete associated ingredient lines
          for (const line of recipe.ingredientLines) {
            const lineFilePath = this.getIngredientLineFilePath(line.id);
            try {
              await fs.unlink(lineFilePath);
            } catch {
              // Line file might not exist
            }
          }
        } catch {
          // Recipe file might not exist
        }
      })
    );
  }
}
