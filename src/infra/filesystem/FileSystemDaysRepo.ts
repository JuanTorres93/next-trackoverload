import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
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
  type: 'meal';
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineData[];
  createdAt: string;
  updatedAt: string;
};

type FakeMealData = {
  type: 'fakemeal';
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt: string;
};

type DayData = {
  id: string; // YYYYMMDD
  userId: string;
  meals: (MealData | FakeMealData)[];
  createdAt: string;
  updatedAt: string;
};

export class FileSystemDaysRepo implements DaysRepo {
  private readonly daysDir: string;

  constructor(baseDir: string = './data/days') {
    this.daysDir = baseDir;
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.daysDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private getFilePath(id: string): string {
    // Use ISO date string as filename
    const fileName = id; // YYYY-MM-DD
    return path.join(this.daysDir, `${fileName}.json`);
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
      type: 'meal',
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

  private serializeFakeMeal(fakeMeal: FakeMeal): FakeMealData {
    return {
      type: 'fakemeal',
      id: fakeMeal.id,
      userId: fakeMeal.userId,
      name: fakeMeal.name,
      calories: fakeMeal.calories,
      protein: fakeMeal.protein,
      createdAt: fakeMeal.createdAt.toISOString(),
      updatedAt: fakeMeal.updatedAt.toISOString(),
    };
  }

  private deserializeFakeMeal(data: FakeMealData): FakeMeal {
    return FakeMeal.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  private serializeDay(day: Day): DayData {
    return {
      id: day.id,
      userId: day.userId,
      meals: day.meals.map((meal) =>
        meal instanceof Meal
          ? this.serializeMeal(meal)
          : this.serializeFakeMeal(meal)
      ),
      createdAt: day.createdAt.toISOString(),
      updatedAt: day.updatedAt.toISOString(),
    };
  }

  private deserializeDay(data: DayData): Day {
    return Day.create({
      ...dayIdToDayMonthYear(data.id),
      userId: data.userId,
      meals: data.meals.map((mealData) =>
        mealData.type === 'meal'
          ? this.deserializeMeal(mealData)
          : this.deserializeFakeMeal(mealData)
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveDay(day: Day): Promise<void> {
    await this.ensureDataDir();
    const data = this.serializeDay(day);
    const filePath = this.getFilePath(day.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllDays(): Promise<Day[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.daysDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const days = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.daysDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as DayData;
          return this.deserializeDay(data);
        })
      );

      return days;
    } catch {
      return [];
    }
  }

  async getAllDaysByUserId(userId: string): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => day.userId === userId);
  }

  async getDayById(id: string): Promise<Day | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as DayData;
      return this.deserializeDay(data);
    } catch {
      return null;
    }
  }

  async getDayByIdAndUserId(id: string, userId: string): Promise<Day | null> {
    const day = await this.getDayById(id);
    if (day && day.userId === userId) {
      return day;
    }
    return null;
  }

  async getDaysByDateRange(startDate: string, endDate: string): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => {
      const dayTime = day.id;
      return dayTime >= startDate && dayTime <= endDate;
    });
  }

  async getDaysByDateRangeAndUserId(
    startDate: string,
    endDate: string,
    userId: string
  ): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => {
      const dayTime = day.id;
      return (
        dayTime >= startDate && dayTime <= endDate && day.userId === userId
      );
    });
  }

  async deleteDay(id: string): Promise<void> {
    const filePath = this.getFilePath(id);

    try {
      await fs.unlink(filePath);
    } catch {
      // No error for non-existent days - consistent with other repos
    }
  }
}
