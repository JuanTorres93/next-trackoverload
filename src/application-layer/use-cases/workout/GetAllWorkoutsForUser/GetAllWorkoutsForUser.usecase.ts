import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllWorkoutsForUserRequest = { userId: string };

export class GetAllWorkoutsForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<Workout[]> {
    validateNonEmptyString(request.userId, 'GetAllWorkoutsForUser userId');

    const workouts = await this.workoutsRepo.getAllWorkoutsByUserId(
      request.userId
    );

    return workouts || [];
  }
}
