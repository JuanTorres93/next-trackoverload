import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type UpdateExerciseInWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber?: number;
  reps?: number;
  weight?: number;
};

export class UpdateExerciseInWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: UpdateExerciseInWorkoutUsecaseRequest
  ): Promise<WorkoutDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `UpdateExerciseInWorkoutUsecase: User with id ${request.userId} not found`
      );
    }

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.workoutId,
      request.userId
    );

    if (!workout) {
      throw new NotFoundError(
        'UpdateExerciseInWorkoutUsecase: Workout not found'
      );
    }

    // NOTE: The validation of the update properties is handled in the entity
    workout.updateExercise(request.exerciseId, {
      setNumber: request.setNumber,
      reps: request.reps,
      weight: request.weight,
    });

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
