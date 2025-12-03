import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type DeleteDayUsecaseRequest = {
  dayId: string;
  userId: string;
};

export class DeleteDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo
  ) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DeleteDayUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId
    );
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    // Delete child independent entities (meals and fake meals)
    const dayMealsIds = day.meals
      .filter(
        // @ts-expect-error only Meal instances have ingredientLines, so it is safe to filter like this
        (meal) => meal.ingredientLines !== undefined
      )
      .map((meal) => meal.id);

    const dayFakeMealsIds = day.meals
      .filter(
        // @ts-expect-error only Meal instances have ingredientLines, so it is safe to filter like this
        (meal) => !meal.ingredientLines
      )
      .map((meal) => meal.id);

    await this.mealsRepo.deleteMultipleMeals(dayMealsIds);
    await this.fakeMealsRepo.deleteMultipleFakeMeals(dayFakeMealsIds);

    // Delete the day itself
    await this.daysRepo.deleteDayForUser(request.dayId, request.userId);
  }
}
