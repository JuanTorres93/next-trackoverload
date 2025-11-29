import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
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

export class FileSystemIngredientsRepo implements IngredientsRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = './data/ingredients') {
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

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    await this.ensureDataDir();
    const data = this.serializeIngredient(ingredient);
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
          const data = JSON.parse(content) as IngredientData;
          return this.deserializeIngredient(data);
        })
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
      const data = JSON.parse(content) as IngredientData;
      return this.deserializeIngredient(data);
    } catch {
      return null;
    }
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

  async getByFuzzyName(name: string): Promise<Ingredient[]> {
    const searchTerm = name.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    const allIngredients = await this.getAllIngredients();

    return allIngredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm)
    );
  }
}
