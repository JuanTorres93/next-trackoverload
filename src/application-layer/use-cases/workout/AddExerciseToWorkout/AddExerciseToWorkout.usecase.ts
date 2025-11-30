import { v4 as uuidv4 } from 'uuid';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import {
  validateGreaterThanZero,
  validateInteger,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@/domain/common/validation';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';

export type AddExerciseToWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
};

export class AddExerciseToWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private exercisesRepo: ExercisesRepo
  ) {}

  async execute(
    request: AddExerciseToWorkoutUsecaseRequest
  ): Promise<WorkoutDTO> {
    validateNonEmptyString(request.userId, 'AddExerciseToWorkout userId');
    validateNonEmptyString(request.workoutId, 'AddExerciseToWorkout workoutId');
    validateNonEmptyString(
      request.exerciseId,
      'AddExerciseToWorkout exerciseId'
    );
    validateGreaterThanZero(
      request.setNumber,
      'AddExerciseToWorkout setNumber'
    );
    validateInteger(request.setNumber, 'AddExerciseToWorkout setNumber');
    validatePositiveNumber(request.reps, 'AddExerciseToWorkout reps');
    validateInteger(request.reps, 'AddExerciseToWorkout reps');
    validatePositiveNumber(request.weight, 'AddExerciseToWorkout weight');

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.workoutId,
      request.userId
    );

    if (!workout) {
      throw new NotFoundError('AddExerciseToWorkoutUsecase: Workout not found');
    }

    const exercise = await this.exercisesRepo.getExerciseById(
      request.exerciseId
    );
    if (!exercise) {
      throw new NotFoundError(
        'AddExerciseToWorkoutUsecase: Exercise not found'
      );
    }

    const workoutLine: WorkoutLine = WorkoutLine.create({
      id: uuidv4(),
      workoutId: workout.id,
      exerciseId: request.exerciseId,
      setNumber: request.setNumber,
      reps: request.reps,
      weight: request.weight,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // NOTE: duplicate exercise handled in entity
    workout.addExercise(workoutLine);

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
