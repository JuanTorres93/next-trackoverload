import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutUpdateProps } from '@/domain/entities/workout/Workout';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type UpdateWorkoutUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: UpdateWorkoutUsecaseRequest): Promise<WorkoutDTO> {
    const existingWorkout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    if (!existingWorkout) {
      throw new NotFoundError('UpdateWorkoutUsecase: Workout not found');
    }

    const patch: WorkoutUpdateProps = {
      name: request.name,
    };

    existingWorkout.update(patch);

    await this.workoutsRepo.saveWorkout(existingWorkout);

    return toWorkoutDTO(existingWorkout);
  }
}
