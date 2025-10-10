import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutByIdForUseUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutByIdForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutByIdForUseUsecaseRequest
  ): Promise<Workout | null> {
    validateNonEmptyString(request.id, 'GetWorkoutByIdUsecase id');
    validateNonEmptyString(request.userId, 'GetWorkoutByIdUsecase userId');

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    return workout || null;
  }
}
