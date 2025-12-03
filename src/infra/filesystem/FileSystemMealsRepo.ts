import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
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

type MealData = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineData[];
  createdAt: string;
  updatedAt: string;
};

export class FileSystemMealsRepo implements MealsRepo {
  private readonly mealsDir: string;
  private readonly ingredientLinesDir: string;

  constructor(
    mealsBaseDir: string = './data/meals',
    ingredientLinesBaseDir: string = './data/ingredientlines'
  ) {
    this.mealsDir = mealsBaseDir;
    this.ingredientLinesDir = ingredientLinesBaseDir;
  }

  private async ensureDataDirs(): Promise<void> {
    try {
      await fs.mkdir(this.mealsDir, { recursive: true });
      await fs.mkdir(this.ingredientLinesDir, { recursive: true });
    } catch {
      // Directories might already exist
    }
  }

  private getMealFilePath(id: string): string {
    return path.join(this.mealsDir, `${id}.json`);
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

  private serializeMeal(meal: Meal): MealData {
    return {
      id: meal.id,
      userId: meal.userId,
      name: meal.name,
      ingredientLines: meal.ingredientLines.map((line) =>
        this.serializeIngredientLine(line)
      ),
      createdAt: meal.createdAt.toISOString(),
      updatedAt: meal.updatedAt.toISOString(),
    };
  }

  private deserializeMeal(data: MealData): Meal {
    return Meal.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      ingredientLines: data.ingredientLines.map((lineData) =>
        this.deserializeIngredientLine(lineData)
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveMeal(meal: Meal): Promise<void> {
    await this.ensureDataDirs();
    const data = this.serializeMeal(meal);
    const filePath = this.getMealFilePath(meal.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save ingredient lines separately
    for (const line of meal.ingredientLines) {
      const lineData = this.serializeIngredientLine(line);
      const lineFilePath = this.getIngredientLineFilePath(line.id);
      await fs.writeFile(lineFilePath, JSON.stringify(lineData, null, 2));
    }
  }

  async getAllMeals(): Promise<Meal[]> {
    await this.ensureDataDirs();

    try {
      const files = await fs.readdir(this.mealsDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const meals = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.mealsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as MealData;
          return this.deserializeMeal(data);
        })
      );

      return meals;
    } catch {
      return [];
    }
  }

  async getAllMealsForUser(userId: string): Promise<Meal[]> {
    const allMeals = await this.getAllMeals();
    return allMeals.filter((meal) => meal.userId === userId);
  }

  async getMealById(id: string): Promise<Meal | null> {
    const filePath = this.getMealFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as MealData;
      return this.deserializeMeal(data);
    } catch {
      return null;
    }
  }

  async getMealByIdForUser(id: string, userId: string): Promise<Meal | null> {
    const meal = await this.getMealById(id);
    if (meal && meal.userId === userId) {
      return meal;
    }
    return null;
  }

  async deleteMeal(id: string): Promise<void> {
    const filePath = this.getMealFilePath(id);

    try {
      // Get the meal to find its ingredient lines
      const meal = await this.getMealById(id);

      // Delete the meal file
      await fs.unlink(filePath);

      // Delete associated ingredient lines
      if (meal) {
        for (const line of meal.ingredientLines) {
          const lineFilePath = this.getIngredientLineFilePath(line.id);
          try {
            await fs.unlink(lineFilePath);
          } catch {
            // Line file might not exist
          }
        }
      }
    } catch {
      // NOTE: Throw error in use case in order not to have false positives in tests
      return Promise.reject(null);
    }
  }

  async deleteMultipleMeals(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const meal = await this.getMealById(id);
        if (meal) {
          const filePath = this.getMealFilePath(id);
          try {
            await fs.unlink(filePath);
            // Delete associated ingredient lines
            for (const line of meal.ingredientLines) {
              const lineFilePath = this.getIngredientLineFilePath(line.id);
              try {
                await fs.unlink(lineFilePath);
              } catch {
                // Line file might not exist
              }
            }
          } catch {
            // Meal file might not exist
          }
        }
      })
    );
  }
}
