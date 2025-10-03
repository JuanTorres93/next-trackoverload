import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError } from '@/domain/common/errors';

export class MemoryExercisesRepo implements ExercisesRepo {
  private exercises: Exercise[] = [];

  async saveExercise(exercise: Exercise): Promise<void> {
    this.exercises.push(exercise);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.exercises;
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const exercise = this.exercises.find((ex) => ex.id === id);
    return exercise || null;
  }

  async deleteExercise(id: string): Promise<void> {
    const index = this.exercises.findIndex((ex) => ex.id === id);
    if (index === -1)
      throw new NotFoundError('MemoryExercisesRepo: Exercise not found');

    this.exercises.splice(index, 1);
  }
}
