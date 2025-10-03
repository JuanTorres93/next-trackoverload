import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';

export class GetAllExercisesUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(): Promise<Exercise[]> {
    return await this.exercisesRepo.getAllExercises();
  }
}
