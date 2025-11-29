import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import fs from 'fs/promises';
import path from 'path';

type IngredientData = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type IngredientLineData = {
  id: string;
  parentId: string;
  parentType: 'meal' | 'recipe';
  ingredient: IngredientData;
  quantityInGrams: number;
  createdAt: string;
  updatedAt: string;
};

type RecipeData = {
  id: string;
  userId: string;
  name: string;
  imageUrl?: string;
  ingredientLines: IngredientLineData[];
  createdAt: string;
  updatedAt: string;
};

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

  private serializeIngredient(ingredient: Ingredient): IngredientData {
    return {
      id: ingredient.id,
      name: ingredient.name,
      calories: ingredient.nutritionalInfoPer100g.calories,
      protein: ingredient.nutritionalInfoPer100g.protein,
      imageUrl: ingredient.imageUrl,
      createdAt: ingredient.createdAt.toISOString(),
      updatedAt: ingredient.updatedAt.toISOString(),
    };
  }

  private deserializeIngredient(data: IngredientData): Ingredient {
    return Ingredient.create({
      id: data.id,
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      imageUrl: data.imageUrl,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  private serializeIngredientLine(line: IngredientLine): IngredientLineData {
    return {
      id: line.id,
      parentId: line.parentId,
      parentType: line.parentType,
      ingredient: this.serializeIngredient(line.ingredient),
      quantityInGrams: line.quantityInGrams,
      createdAt: line.createdAt.toISOString(),
      updatedAt: line.updatedAt.toISOString(),
    };
  }

  private deserializeIngredientLine(data: IngredientLineData): IngredientLine {
    return IngredientLine.create({
      id: data.id,
      parentId: data.parentId,
      parentType: data.parentType,
      ingredient: this.deserializeIngredient(data.ingredient),
      quantityInGrams: data.quantityInGrams,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  private serializeRecipe(recipe: Recipe): RecipeData {
    return {
      id: recipe.id,
      userId: recipe.userId,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      ingredientLines: recipe.ingredientLines.map((line) =>
        this.serializeIngredientLine(line)
      ),
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };
  }

  private deserializeRecipe(data: RecipeData): Recipe {
    return Recipe.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      imageUrl: data.imageUrl,
      ingredientLines: data.ingredientLines.map((lineData) =>
        this.deserializeIngredientLine(lineData)
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    await this.ensureDataDirs();
    const data = this.serializeRecipe(recipe);
    const filePath = this.getRecipeFilePath(recipe.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save ingredient lines separately
    for (const line of recipe.ingredientLines) {
      const lineData = this.serializeIngredientLine(line);
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
          const data = JSON.parse(content) as RecipeData;
          return this.deserializeRecipe(data);
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
      const data = JSON.parse(content) as RecipeData;
      return this.deserializeRecipe(data);
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
}
