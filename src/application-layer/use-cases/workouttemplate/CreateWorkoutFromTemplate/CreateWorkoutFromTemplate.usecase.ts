import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Id } from '@/domain/types/Id/Id';
import { v4 as uuidv4 } from 'uuid';
import { validateNonEmptyString } from '@/domain/common/validation';

export type CreateWorkoutFromTemplateUsecaseRequest = {
  userId: string;
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
  ): Promise<WorkoutDTO> {
    validateNonEmptyString(
      request.userId,
      'CreateWorkoutFromTemplateUsecase userId'
    );
    validateNonEmptyString(
      request.workoutTemplateId,
      'CreateWorkoutFromTemplateUsecase workoutTemplateId'
    );

    if (request.workoutName !== undefined)
      validateNonEmptyString(
        request.workoutName,
        'CreateWorkoutFromTemplateUsecase workoutName'
      );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
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
      id: Id.create(uuidv4()),
      userId: Id.create(request.userId),
      name:
        request.workoutName ??
        `${workoutTemplate.name} - ${new Date().toLocaleDateString()}`,
      workoutTemplateId: Id.create(request.workoutTemplateId),
      exercises: workoutExercises,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutsRepo.saveWorkout(newWorkout);

    return toWorkoutDTO(newWorkout);
  }
}
