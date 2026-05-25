import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";

export type DeleteWorkoutUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: DeleteWorkoutUsecaseRequest): Promise<void> {
    const [user, workout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `DeleteWorkoutUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!workout) {
      logNoTest(
        `DeleteWorkoutUsecase: workout with id ${request.id} not found`,
      );

      throw new NotFoundError("El entrenamiento no existe.");
    }

    await this.workoutsRepo.deleteWorkout(request.id);
  }
}
