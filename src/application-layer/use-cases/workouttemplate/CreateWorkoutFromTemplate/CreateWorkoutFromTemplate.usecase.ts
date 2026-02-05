import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type CreateWorkoutFromTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  workoutName?: string;
};

export class CreateWorkoutFromTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: CreateWorkoutFromTemplateUsecaseRequest,
  ): Promise<WorkoutDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateWorkoutFromTemplateUsecase: User with id ${request.userId} not found`,
      );
    }

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId,
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'CreateWorkoutFromTemplateUsecase: WorkoutTemplate not found',
      );
    }

    if (workoutTemplate.exercises.length === 0)
      throw new ValidationError(
        'CreateWorkoutFromTemplateUsecase: Cannot create workout from an empty template',
      );

    const newWorkoutId = this.idGenerator.generateId();

    // Create a WorkoutLine for each set of each exercise in the template
    const workoutExercises = [];
    for (const templateExercise of workoutTemplate.exercises) {
      for (let setNumber = 1; setNumber <= templateExercise.sets; setNumber++) {
        const workoutLine: WorkoutLine = WorkoutLine.create({
          id: this.idGenerator.generateId(),
          workoutId: newWorkoutId,
          exerciseId: templateExercise.exerciseId,
          setNumber,
          reps: 0,
          weightInKg: 0,
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
    });

    await this.workoutsRepo.saveWorkout(newWorkout);

    return toWorkoutDTO(newWorkout);
  }
}
