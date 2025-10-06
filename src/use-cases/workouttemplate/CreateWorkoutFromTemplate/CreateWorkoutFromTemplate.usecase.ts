import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';
import { validateNonEmptyString } from '@/domain/common/validation';

export type CreateWorkoutFromTemplateUsecaseRequest = {
  workoutTemplateId: string;
  workoutName?: string;
};

export class CreateWorkoutFromTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private workoutsRepo: WorkoutsRepo
  ) {}

  async execute(
    request: CreateWorkoutFromTemplateUsecaseRequest
  ): Promise<Workout> {
    if (request.workoutName !== undefined)
      validateNonEmptyString(
        request.workoutName,
        'CreateWorkoutFromTemplateUsecase workoutName'
      );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(
        request.workoutTemplateId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'CreateWorkoutTemplateUsecase: WorkoutTemplate not found'
      );
    }

    if (workoutTemplate.exercises.length === 0)
      throw new ValidationError(
        'CreateWorkoutFromTemplateUsecase: Cannot create workout from an empty template'
      );

    // Convert template exercises to workout exercises
    const workoutExercises = [];
    for (const templateExercise of workoutTemplate.exercises) {
      for (let setNumber = 1; setNumber <= templateExercise.sets; setNumber++) {
        workoutExercises.push({
          exerciseId: templateExercise.exerciseId,
          setNumber,
          reps: 0,
          weight: 0,
        });
      }
    }

    const newWorkout = Workout.create({
      id: uuidv4(),
      name:
        request.workoutName ??
        `${workoutTemplate.name} - ${new Date().toLocaleDateString()}`,
      workoutTemplateId: request.workoutTemplateId,
      exercises: workoutExercises,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutsRepo.saveWorkout(newWorkout);

    return newWorkout;
  }
}
