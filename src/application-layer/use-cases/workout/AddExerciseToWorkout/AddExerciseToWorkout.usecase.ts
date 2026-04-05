import { WorkoutDTO, toWorkoutDTO } from "@/application-layer/dtos/WorkoutDTO";
import { TransactionContext } from "@/application-layer/ports/TransactionContext.port";
import { NotFoundError } from "@/domain/common/errors";
import { WorkoutLine } from "@/domain/entities/workoutline/WorkoutLine";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "@/domain/repos/WorkoutsRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

import { createExercisesAndExternalExercisesNoSaveInRepo } from "../../exercise/common/createExercisesAndExternalExercisesNoSaveInRepo";

export type AddExerciseToWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  externalExerciseId: string;
  source: string;
  name: string;
  setNumber: number;
  reps: number;
  weightInKg: number;
};

export class AddExerciseToWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private exercisesRepo: ExercisesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private externalExercisesRefRepo: ExternalExercisesRefRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: AddExerciseToWorkoutUsecaseRequest,
  ): Promise<WorkoutDTO> {
    const [user, workout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(
        request.workoutId,
        request.userId,
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `AddExerciseToWorkoutUsecase: user with id ${request.userId} not found`,
      );
    }

    if (!workout) {
      throw new NotFoundError("AddExerciseToWorkoutUsecase: Workout not found");
    }

    const { createdExercises, createdExternalExercises, allExercises } =
      await createExercisesAndExternalExercisesNoSaveInRepo(
        [
          {
            externalExerciseId: request.externalExerciseId,
            source: request.source,
            name: request.name,
          },
        ],
        this.exercisesRepo,
        this.externalExercisesRefRepo,
        this.idGenerator,
      );

    const exerciseToAdd = allExercises[0];

    const workoutLine: WorkoutLine = WorkoutLine.create({
      id: this.idGenerator.generateId(),
      workoutId: workout.id,
      exerciseId: exerciseToAdd.id,
      setNumber: request.setNumber,
      reps: request.reps,
      weightInKg: request.weightInKg,
    });

    workout.addExercise(workoutLine);

    await this.transactionContext.run(async () => {
      if (Object.keys(createdExternalExercises).length > 0) {
        const externalExercise = Object.values(createdExternalExercises)[0];

        await this.externalExercisesRefRepo.save(externalExercise);
      }

      if (Object.keys(createdExercises).length > 0) {
        const exercise = Object.values(createdExercises)[0];

        await this.exercisesRepo.saveExercise(exercise);
      }

      await this.workoutsRepo.saveWorkout(workout);
    });

    return toWorkoutDTO(workout);
  }
}
