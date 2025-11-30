import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { v4 as uuidv4 } from 'uuid';

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

    const newWorkoutId = uuidv4();

    // Convert template exercises to workout exercises
    const workoutExercises = [];
    for (const templateExercise of workoutTemplate.exercises) {
      for (let setNumber = 1; setNumber <= templateExercise.sets; setNumber++) {
        const workoutLine: WorkoutLine = WorkoutLine.create({
          id: uuidv4(),
          workoutId: newWorkoutId,
          exerciseId: templateExercise.exerciseId,
          setNumber,
          reps: 0,
          weight: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        workoutExercises.push(workoutLine);
      }
    }

    const newWorkout = Workout.create({
      id: newWorkoutId,
      userId: request.userId,
      name:
        request.workoutName ??
        `${workoutTemplate.name} - ${new Date().toLocaleDateString()}`,
      workoutTemplateId: request.workoutTemplateId,
      exercises: workoutExercises,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutsRepo.saveWorkout(newWorkout);

    return toWorkoutDTO(newWorkout);
  }
}
