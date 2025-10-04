import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';

export class MemoryExercisesRepo implements ExercisesRepo {
  private exercises: Exercise[] = [];

  async saveExercise(exercise: Exercise): Promise<void> {
    const index = this.exercises.findIndex((ex) => ex.id === exercise.id);
    if (index === -1) {
      this.exercises.push(exercise);
    } else {
      this.exercises[index] = exercise;
    }
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
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.exercises.splice(index, 1);
  }
}
