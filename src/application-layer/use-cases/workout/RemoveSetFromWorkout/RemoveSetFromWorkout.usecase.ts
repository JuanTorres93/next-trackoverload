import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError } from '@/domain/common/errors';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
  validateInteger,
} from '@/domain/common/validation';

export type RemoveSetFromWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
};

export class RemoveSetFromWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: RemoveSetFromWorkoutUsecaseRequest): Promise<Workout> {
    validateNonEmptyString(request.userId, 'RemoveSetFromWorkout userId');
    validateNonEmptyString(request.workoutId, 'RemoveSetFromWorkout workoutId');
    validateNonEmptyString(
      request.exerciseId,
      'RemoveSetFromWorkout exerciseId'
    );
    validateGreaterThanZero(
      request.setNumber,
      'RemoveSetFromWorkout setNumber'
    );
    validateInteger(request.setNumber, 'RemoveSetFromWorkout setNumber');

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.workoutId,
      request.userId
    );

    if (!workout) {
      throw new NotFoundError('RemoveSetFromWorkoutUsecase: Workout not found');
    }

    workout.removeSet(request.exerciseId, request.setNumber);

    await this.workoutsRepo.saveWorkout(workout);

    return workout;
  }
}
