import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { v4 as uuidv4 } from 'uuid';

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
    private exercisesRepo: ExercisesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: AddExerciseToWorkoutUsecaseRequest
  ): Promise<WorkoutDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddExerciseToWorkoutUsecase: user with id ${request.userId} not found`
      );
    }

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

    workout.addExercise(workoutLine);

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
