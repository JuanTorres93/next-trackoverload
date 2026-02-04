import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { UnitOfWork } from '@/application-layer/unit-of-work/UnitOfWork.port';

export type DeleteDayUsecaseRequest = {
  dayId: string;
  userId: string;
};

export class DeleteDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DeleteDayUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    // Delete child independent entities (meals and fake meals)
    await this.unitOfWork.inTransaction(async () => {
      await this.mealsRepo.deleteMultipleMeals(day.mealIds);
      await this.fakeMealsRepo.deleteMultipleFakeMeals(day.fakeMealIds);

      // Delete the day itself
      await this.daysRepo.deleteDayForUser(request.dayId, request.userId);
    });
  }
}
