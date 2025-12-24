import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import {
  FakeMealDTO,
  toFakeMealDTO,
  fromFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemFakeMealsRepo implements FakeMealsRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = path.join(FS_DATA_DIR, 'fakemeals')) {
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

  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    await this.ensureDataDir();
    const data = toFakeMealDTO(fakeMeal);
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
          const data = JSON.parse(content) as FakeMealDTO;
          return fromFakeMealDTO(data);
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
      const data = JSON.parse(content) as FakeMealDTO;
      return fromFakeMealDTO(data);
    } catch {
      return null;
    }
  }

  async getFakeMealByIds(ids: string[]): Promise<FakeMeal[]> {
    const fakeMeals = await Promise.all(
      ids.map(async (id) => {
        const fakeMeal = await this.getFakeMealById(id);
        return fakeMeal;
      })
    );
    return fakeMeals.filter(
      (fakeMeal): fakeMeal is FakeMeal => fakeMeal !== null
    );
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

  async deleteMultipleFakeMeals(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const filePath = this.getFilePath(id);
        try {
          await fs.unlink(filePath);
        } catch {
          // File might not exist
        }
      })
    );
  }

  async deleteAllFakeMealsForUser(userId: string): Promise<void> {
    const allFakeMeals = await this.getAllFakeMeals();
    const userFakeMeals = allFakeMeals.filter((fm) => fm.userId === userId);

    await Promise.all(
      userFakeMeals.map(async (fakeMeal) => {
        const filePath = this.getFilePath(fakeMeal.id);
        try {
          await fs.unlink(filePath);
        } catch {
          // File might not exist
        }
      })
    );
  }
}
