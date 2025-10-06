import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutByIdUsecaseRequest = {
  id: string;
};

export class GetWorkoutByIdUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutByIdUsecaseRequest
  ): Promise<Workout | null> {
    validateNonEmptyString(request.id, 'GetWorkoutByIdUsecase');

    const workout = await this.workoutsRepo.getWorkoutById(request.id);

    return workout || null;
  }
}
