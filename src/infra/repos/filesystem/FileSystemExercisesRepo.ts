import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

type ExerciseData = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class FileSystemExercisesRepo implements ExercisesRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = path.join(FS_DATA_DIR, 'exercises')) {
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

  private serializeExercise(exercise: Exercise): ExerciseData {
    return {
      id: exercise.id,
      name: exercise.name,
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }

  private deserializeExercise(data: ExerciseData): Exercise {
    return Exercise.create({
      id: data.id,
      name: data.name,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    await this.ensureDataDir();
    const data = this.serializeExercise(exercise);
    const filePath = this.getFilePath(exercise.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllExercises(): Promise<Exercise[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const exercises = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.dataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as ExerciseData;
          return this.deserializeExercise(data);
        })
      );

      return exercises;
    } catch {
      return [];
    }
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as ExerciseData;
      return this.deserializeExercise(data);
    } catch {
      return null;
    }
  }

  async deleteExercise(id: string): Promise<void> {
    const filePath = this.getFilePath(id);

    try {
      await fs.unlink(filePath);
    } catch {
      // File might not exist, consistent with memory repo
    }
  }
}
