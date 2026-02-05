import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientDTO,
  toIngredientDTO,
  fromIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemIngredientsRepo implements IngredientsRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = path.join(FS_DATA_DIR, 'ingredients')) {
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

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    await this.ensureDataDir();
    const data = toIngredientDTO(ingredient);
    const filePath = this.getFilePath(ingredient.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const ingredients = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.dataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as IngredientDTO;
          return fromIngredientDTO(data);
        }),
      );

      return ingredients;
    } catch {
      return [];
    }
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as IngredientDTO;
      return fromIngredientDTO(data);
    } catch {
      return null;
    }
  }

  async getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
    const ingredients = await Promise.all(
      ids.map(async (id) => {
        const ingredient = await this.getIngredientById(id);
        return ingredient;
      }),
    );

    return ingredients.filter(
      (ingredient): ingredient is Ingredient => ingredient !== null,
    );
  }

  async deleteIngredient(id: string): Promise<void> {
    const filePath = this.getFilePath(id);

    try {
      await fs.unlink(filePath);
    } catch {
      // Validation is done in the use case to avoid false positives when using a real repo
      return Promise.reject(null);
    }
  }
}
