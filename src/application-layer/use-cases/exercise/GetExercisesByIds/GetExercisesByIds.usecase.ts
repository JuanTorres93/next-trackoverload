import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { Exercise } from '@/domain/entities/exercise/Exercise';

export type GetExercisesByIdsUsecaseRequest = {
  ids: string[];
};

export class GetExercisesByIdsUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExercisesByIdsUsecaseRequest
  ): Promise<ExerciseDTO[]> {
    const exercises: Exercise[] = [];

    // First, validate all IDs
    for (const id of request.ids) {
      validateNonEmptyString(id, 'GetExercisesByIdsUsecase');
    }

    // Then, fetch exercises to avoid partial results if validation fails
    for (const id of request.ids) {
      const exercise = await this.exercisesRepo.getExerciseById(id);
      if (exercise) {
        exercises.push(exercise);
      }
    }

    return exercises.map(toExerciseDTO);
  }
}
