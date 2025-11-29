import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import fs from 'fs/promises';
import path from 'path';

type FakeMealData = {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt: string;
};

export class FileSystemFakeMealsRepo implements FakeMealsRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = './data/fakemeals') {
    this.dataDir = baseDir;
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private getFilePath(id: string): string {
    return path.join(this.dataDir, `${id}.json`);
  }

  private serializeFakeMeal(fakeMeal: FakeMeal): FakeMealData {
    return {
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

  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    await this.ensureDataDir();
    const data = this.serializeFakeMeal(fakeMeal);
    const filePath = this.getFilePath(fakeMeal.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllFakeMeals(): Promise<FakeMeal[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const fakeMeals = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.dataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as FakeMealData;
          return this.deserializeFakeMeal(data);
        })
      );

      return fakeMeals;
    } catch {
      return [];
    }
  }

  async getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]> {
    const allFakeMeals = await this.getAllFakeMeals();
    return allFakeMeals.filter((fakeMeal) => fakeMeal.userId === userId);
  }

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as FakeMealData;
      return this.deserializeFakeMeal(data);
    } catch {
      return null;
    }
  }

  async getFakeMealByIdAndUserId(
    id: string,
    userId: string
  ): Promise<FakeMeal | null> {
    const fakeMeal = await this.getFakeMealById(id);
    if (fakeMeal && fakeMeal.userId === userId) {
      return fakeMeal;
    }
    return null;
  }

  async deleteFakeMeal(id: string): Promise<void> {
    const filePath = this.getFilePath(id);

    try {
      await fs.unlink(filePath);
    } catch {
      // File might not exist, consistent with memory repo
    }
  }

  async deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void> {
    const fakeMeal = await this.getFakeMealById(id);
    if (fakeMeal && fakeMeal.userId === userId) {
      await this.deleteFakeMeal(id);
    }
  }
}
