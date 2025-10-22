import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type DeleteWorkoutUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: DeleteWorkoutUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteWorkoutUsecase: id');
    validateNonEmptyString(request.userId, 'DeleteWorkoutUsecase: userId');

    // Search workout
    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    if (!workout) {
      throw new NotFoundError('DeleteWorkoutUsecase: Workout not found');
    }

    await this.workoutsRepo.deleteWorkout(request.id);
  }
}
