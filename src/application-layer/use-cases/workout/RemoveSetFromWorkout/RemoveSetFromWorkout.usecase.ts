import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type RemoveSetFromWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
};

export class RemoveSetFromWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: RemoveSetFromWorkoutUsecaseRequest,
  ): Promise<WorkoutDTO> {
    const [user, workout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(
        request.workoutId,
        request.userId,
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `RemoveSetFromWorkoutUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!workout) {
      throw new NotFoundError('RemoveSetFromWorkoutUsecase: Workout not found');
    }

    workout.removeSet(request.exerciseId, request.setNumber);

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
