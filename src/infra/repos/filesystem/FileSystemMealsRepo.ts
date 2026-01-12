import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import {
  fromMealDTO,
  MealDTO,
  toMealDTO,
} from '@/application-layer/dtos/MealDTO';
import { Meal } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemMealsRepo implements MealsRepo {
  private readonly mealsDir: string;
  private readonly ingredientLinesDir: string;

  constructor(
    mealsBaseDir: string = path.join(FS_DATA_DIR, 'meals'),
    ingredientLinesBaseDir: string = path.join(FS_DATA_DIR, 'ingredientlines')
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

  async saveMeal(meal: Meal): Promise<void> {
    await this.ensureDataDirs();
    const data = toMealDTO(meal);
    const filePath = this.getMealFilePath(meal.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save ingredient lines separately
    for (const line of meal.ingredientLines) {
      const lineData = toIngredientLineDTO(line);
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
          const data = JSON.parse(content) as MealDTO;
          return fromMealDTO(data);
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
      const data = JSON.parse(content) as MealDTO;
      return fromMealDTO(data);
    } catch {
      return null;
    }
  }

  async getMealByIds(ids: string[]): Promise<Meal[]> {
    const meals = await Promise.all(
      ids.map(async (id) => {
        const meal = await this.getMealById(id);
        return meal;
      })
    );
    return meals.filter((meal): meal is Meal => meal !== null);
  }

  async getMealByIdForUser(id: string, userId: string): Promise<Meal | null> {
    const meal = await this.getMealById(id);
    if (meal && meal.userId === userId) {
      return meal;
    }
    return null;
  }

  async getMealsByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Meal[]> {
    const allMeals = await this.getAllMeals();
    return allMeals.filter(
      (meal) => meal.createdFromRecipeId === recipeId && meal.userId === userId
    );
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

  async deleteAllMealsForUser(userId: string): Promise<void> {
    const allMeals = await this.getAllMeals();
    const userMeals = allMeals.filter((m) => m.userId === userId);

    await Promise.all(
      userMeals.map(async (meal) => {
        const filePath = this.getMealFilePath(meal.id);
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
      })
    );
  }
}
