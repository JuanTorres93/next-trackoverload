import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';
import { Id } from '@/domain/value-objects/Id/Id';

export class FileSystemExercisesRepo
  extends BaseFileSystemRepo<Exercise>
  implements ExercisesRepo
{
  constructor() {
    super('exercises.json');
  }

  protected getItemId(item: Exercise): string {
    return item.id;
  }

  protected serializeItems(items: Exercise[]): ExerciseDTO[] {
    return items.map(toExerciseDTO);
  }

  protected deserializeItems(data: unknown[]): Exercise[] {
    return (data as ExerciseDTO[]).map((item) =>
      Exercise.create({
        ...item,
        id: Id.create(item.id),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
    );
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    return this.saveItem(exercise);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.getAllItems();
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    return this.getItemById(id);
  }

  async deleteExercise(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
