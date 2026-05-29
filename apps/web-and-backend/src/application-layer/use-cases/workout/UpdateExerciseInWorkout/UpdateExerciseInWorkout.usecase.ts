import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { WorkoutDTO, toWorkoutDTO } from "../../../dtos/WorkoutDTO";

export type UpdateExerciseInWorkoutUsecaseRequest = {
  userId: string;
  workoutId: string;
  exerciseId: string;
  setNumber?: number;
  reps?: number;
  weightInKg?: number;
};

export class UpdateExerciseInWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: UpdateExerciseInWorkoutUsecaseRequest,
  ): Promise<WorkoutDTO> {
    const [user, workout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(
        request.workoutId,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `UpdateExerciseInWorkoutUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!workout) {
      logNoTest(
        `UpdateExerciseInWorkoutUsecase: workout with id ${request.workoutId} not found`,
      );

      throw new NotFoundError("El entrenamiento no existe.");
    }

    workout.updateExercise(request.exerciseId, {
      setNumber: request.setNumber,
      reps: request.reps,
      weightInKg: request.weightInKg,
    });

    await this.workoutsRepo.saveWorkout(workout);

    return toWorkoutDTO(workout);
  }
}
