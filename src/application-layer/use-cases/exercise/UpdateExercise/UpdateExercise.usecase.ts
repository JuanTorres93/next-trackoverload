import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';

export type UpdateExerciseUsecaseRequest = {
  id: string;
  name?: string;
};

export class UpdateExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: UpdateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const existingExercise = await this.exercisesRepo.getExerciseById(
      request.id
    );

    if (!existingExercise) {
      throw new NotFoundError('UpdateExerciseUsecase: Exercise not found');
    }

    const updatedExercise = Exercise.create({
      id: existingExercise.id,
      name: request.name ?? existingExercise.name,
      createdAt: existingExercise.createdAt,
      updatedAt: new Date(),
    });

    await this.exercisesRepo.saveExercise(updatedExercise);

    return toExerciseDTO(updatedExercise);
  }
}
