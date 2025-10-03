import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';

export type DeleteExerciseUsecaseRequest = {
  id: string;
};

export class DeleteExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: DeleteExerciseUsecaseRequest): Promise<void> {
    await this.exercisesRepo.deleteExercise(request.id);
  }
}
