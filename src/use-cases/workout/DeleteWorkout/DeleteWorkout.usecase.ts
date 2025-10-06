import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type DeleteWorkoutUsecaseRequest = {
  id: string;
};

export class DeleteWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: DeleteWorkoutUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteWorkoutUsecase: id');

    // Search workout
    const workout = await this.workoutsRepo.getWorkoutById(request.id);

    if (!workout) {
      throw new NotFoundError('DeleteWorkoutUsecase: Workout not found');
    }

    await this.workoutsRepo.deleteWorkout(request.id);
  }
}
