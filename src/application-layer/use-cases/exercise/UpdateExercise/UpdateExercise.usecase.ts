import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { Id } from '@/domain/value-objects/Id/Id';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateExerciseUsecaseRequest = {
  id: string;
  name?: string;
};

export class UpdateExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: UpdateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    validateNonEmptyString(request.id, 'UpdateExerciseUsecase');
    if (request.name !== undefined)
      validateNonEmptyString(request.name, 'UpdateExerciseUsecase');

    const existingExercise = await this.exercisesRepo.getExerciseById(
      request.id
    );

    if (!existingExercise) {
      throw new NotFoundError('Exercise not found');
    }

    const updatedExercise = Exercise.create({
      id: Id.create(existingExercise.id),
      name: request.name ?? existingExercise.name,
      createdAt: existingExercise.createdAt,
      updatedAt: new Date(),
    });

    await this.exercisesRepo.saveExercise(updatedExercise);

    return toExerciseDTO(updatedExercise);
  }
}
