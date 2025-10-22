import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetExerciseByIdUsecaseRequest = {
  id: string;
};

export class GetExerciseByIdUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExerciseByIdUsecaseRequest
  ): Promise<ExerciseDTO | null> {
    validateNonEmptyString(request.id, 'GetExerciseByIdUsecase');

    const exercise = await this.exercisesRepo.getExerciseById(request.id);
    return exercise ? toExerciseDTO(exercise) : null;
  }
}
