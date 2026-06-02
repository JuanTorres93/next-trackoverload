import { WorkoutDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import {
  NotFoundError,
  ValidationError,
} from "../../../../domain/common/errors";
import { Workout } from "../../../../domain/entities/workout/Workout";
import { WorkoutLine } from "../../../../domain/entities/workoutline/WorkoutLine";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { IdGenerator } from "../../../../domain/services/IdGenerator.port";
import { toWorkoutDTO } from "../../../dtos/WorkoutDTO";

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
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `CreateWorkoutFromTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `CreateWorkoutFromTemplateUsecase: WorkoutTemplate with id ${request.workoutTemplateId} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    if (workoutTemplate.exercises.length === 0)
      logNoTest(
        `CreateWorkoutFromTemplateUsecase: Cannot create workout from an empty template`,
      );

    if (workoutTemplate.exercises.length === 0)
      throw new ValidationError(
        "No puedes crear un entrenamiento desde una plantilla vacía.",
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
