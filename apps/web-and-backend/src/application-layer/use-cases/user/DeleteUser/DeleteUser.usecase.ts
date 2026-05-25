import { logNoTest } from "@/domain/utils/logNoTest";

import {
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { FakeMealsRepo } from "../../../../domain/repos/FakeMealsRepo.port";
import { MealsRepo } from "../../../../domain/repos/MealsRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { TransactionContext } from "../../../ports/TransactionContext.port";

export type DeleteUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class DeleteUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private daysRepo: DaysRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private mealsRepo: MealsRepo,
    private recipesRepo: RecipesRepo,
    private workoutsRepo: WorkoutsRepo,
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: DeleteUserUsecaseRequest): Promise<void> {
    if (request.actorUserId !== request.targetUserId) {
      logNoTest(`DeleteUserUsecase: cannot delete another user`);

      throw new PermissionError(
        "No puedes eliminar la cuenta de otro usuario.",
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);

    if (!user) {
      logNoTest(
        `DeleteUserUsecase: User with id ${request.targetUserId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteAllFakeMealsForUser(request.targetUserId);

      await this.mealsRepo.deleteAllMealsForUser(request.targetUserId);

      await this.recipesRepo.deleteAllRecipesForUser(request.targetUserId);

      await this.workoutsRepo.deleteAllWorkoutsForUser(request.targetUserId);

      await this.workoutTemplatesRepo.deleteAllWorkoutTemplatesForUser(
        request.targetUserId,
      );

      await this.daysRepo.deleteAllDaysForUser(request.targetUserId);

      await this.usersRepo.deleteUser(request.targetUserId);
    });
  }
}
