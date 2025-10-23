import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllWorkoutsForUserRequest = { userId: string };

export class GetAllWorkoutsForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<WorkoutDTO[]> {
    validateNonEmptyString(request.userId, 'GetAllWorkoutsForUser userId');

    const workouts = await this.workoutsRepo.getAllWorkoutsByUserId(
      request.userId
    );

    return workouts.map(toWorkoutDTO);
  }
}
