import { NotFoundError } from '@/domain/common/errors';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';

export type DeleteExerciseUsecaseRequest = {
  id: string;
};

export class DeleteExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: DeleteExerciseUsecaseRequest): Promise<void> {
    // Search exercise
    const exercise = await this.exercisesRepo.getExerciseById(request.id);

    if (!exercise) {
      throw new NotFoundError('DeleteExerciseUsecase: Exercise not found');
    }

    await this.exercisesRepo.deleteExercise(request.id);
  }
}
