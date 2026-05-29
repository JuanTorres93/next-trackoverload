import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { WorkoutUpdateProps } from "../../../../domain/entities/workout/Workout";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { WorkoutDTO, toWorkoutDTO } from "../../../dtos/WorkoutDTO";

export type UpdateWorkoutUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: UpdateWorkoutUsecaseRequest): Promise<WorkoutDTO> {
    const [user, existingWorkout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `UpdateWorkoutUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!existingWorkout) {
      logNoTest(
        `UpdateWorkoutUsecase: workout with id ${request.id} not found`,
      );

      throw new NotFoundError("El entrenamiento no existe.");
    }

    const patch: WorkoutUpdateProps = {
      name: request.name,
    };

    existingWorkout.update(patch);

    await this.workoutsRepo.saveWorkout(existingWorkout);

    return toWorkoutDTO(existingWorkout);
  }
}
