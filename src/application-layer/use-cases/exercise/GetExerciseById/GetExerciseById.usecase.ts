import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetExerciseByIdUsecaseRequest = {
  id: string;
};

export class GetExerciseByIdUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExerciseByIdUsecaseRequest
  ): Promise<Exercise | null> {
    validateNonEmptyString(request.id, 'GetExerciseByIdUsecase');

    return await this.exercisesRepo.getExerciseById(request.id);
  }
}
