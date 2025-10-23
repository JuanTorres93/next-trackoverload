import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutByIdForUseUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutByIdForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutByIdForUseUsecaseRequest
  ): Promise<WorkoutDTO | null> {
    validateNonEmptyString(request.id, 'GetWorkoutByIdUsecase id');
    validateNonEmptyString(request.userId, 'GetWorkoutByIdUsecase userId');

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    return workout ? toWorkoutDTO(workout) : null;
  }
}
