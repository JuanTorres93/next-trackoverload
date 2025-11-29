import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type UpdateExerciseInWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber?: number;
  reps?: number;
  weight?: number;
};

export class UpdateExerciseInWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: UpdateExerciseInWorkoutUsecaseRequest
  ): Promise<WorkoutDTO> {
    validateNonEmptyString(request.userId, 'UpdateExerciseInWorkout userId');
    validateNonEmptyString(
      request.workoutId,
      'UpdateExerciseInWorkout workoutId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'UpdateExerciseInWorkout exerciseId'
    );

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
