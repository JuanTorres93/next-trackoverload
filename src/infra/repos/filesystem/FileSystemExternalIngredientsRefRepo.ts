import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import {
  ExternalIngredientRefDTO,
  toExternalIngredientRefDTO,
  fromExternalIngredientRefDTO,
} from '@/application-layer/dtos/ExternalIngredientRefDTO';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemExternalIngredientsRefRepo
  implements ExternalIngredientsRefRepo
{
  private readonly dataDir: string;

  constructor(
    baseDir: string = path.join(FS_DATA_DIR, 'externalingredientsref')
  ) {
    this.dataDir = baseDir;
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private getFilePath(externalId: string, source: string): string {
    const filename = `${externalId}-${source}.json`;
    return path.join(this.dataDir, filename);
  }

  async getByExternalIdAndSource(
    externalId: string,
    source: string
  ): Promise<ExternalIngredientRef | null> {
    const filePath = this.getFilePath(externalId, source);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as ExternalIngredientRefDTO;
      return fromExternalIngredientRefDTO(data);
    } catch {
      return null;
    }
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string
  ): Promise<ExternalIngredientRef[]> {
    const results: ExternalIngredientRef[] = [];

    for (const externalId of externalIds) {
      const ref = await this.getByExternalIdAndSource(externalId, source);
      if (ref) {
        results.push(ref);
      }
    }

    return results;
  }

  async save(externalIngredientRef: ExternalIngredientRef): Promise<void> {
    await this.ensureDataDir();
    const data = toExternalIngredientRefDTO(externalIngredientRef);
    const filePath = this.getFilePath(
      externalIngredientRef.externalId,
      externalIngredientRef.source
    );
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async delete(externalId: string): Promise<void> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(this.dataDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content) as ExternalIngredientRefDTO;

        if (data.externalId === externalId) {
          await fs.unlink(filePath);
        }
      }
    } catch {
      // Error reading files
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  async countForTesting(): Promise<number> {
    await this.ensureDataDir();
    const files = await fs.readdir(this.dataDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    return jsonFiles.length;
  }
}
