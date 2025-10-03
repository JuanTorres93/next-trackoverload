import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetExercisesByIdsUsecaseRequest = {
  ids: string[];
};

export class GetExercisesByIdsUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: GetExercisesByIdsUsecaseRequest): Promise<Exercise[]> {
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

    return exercises;
  }
}
