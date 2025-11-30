import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type RemoveSetFromWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
};

export class RemoveSetFromWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: RemoveSetFromWorkoutUsecaseRequest
  ): Promise<WorkoutDTO> {
    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.workoutId,
      request.userId
    );

    if (!workout) {
      throw new NotFoundError('RemoveSetFromWorkoutUsecase: Workout not found');
    }

    workout.removeSet(request.exerciseId, request.setNumber);

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
