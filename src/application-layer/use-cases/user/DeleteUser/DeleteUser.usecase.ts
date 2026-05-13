import { TransactionContext } from "@/application-layer/ports/TransactionContext.port";
import { NotFoundError, PermissionError } from "@/domain/common/errors";
import { DaysRepo } from "@/domain/repos/DaysRepo.port";
import { FakeMealsRepo } from "@/domain/repos/FakeMealsRepo.port";
import { MealsRepo } from "@/domain/repos/MealsRepo.port";
import { RecipesRepo } from "@/domain/repos/RecipesRepo.port";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "@/domain/repos/WorkoutTemplatesRepo.port";
import { WorkoutsRepo } from "@/domain/repos/WorkoutsRepo.port";

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
      throw new PermissionError(
        "DeleteUserUsecase: cannot delete another user",
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);

    if (!user) {
      throw new NotFoundError("DeleteUserUsecase: User not found");
    }

    await this.transactionContext.run(async () => {
      // IMPORTANT NOTE: These calls are not wrapped in a parallel Promise.all because we want to ensure that the deletion actually happens. Depending on the implementation of the repos, it could happen that the DB blocks the operation or is left in an inconsistent state.

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
