import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type GetWorkoutByIdForUseUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutByIdForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutByIdForUseUsecaseRequest
  ): Promise<WorkoutDTO | null> {
    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    return workout ? toWorkoutDTO(workout) : null;
  }
}
