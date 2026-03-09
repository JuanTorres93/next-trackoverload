import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllMealsInDayForUserUsecaseRequest = {
  userId: string;
  dayId: string;
};

export class GetAllMealsInDayForUserUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetAllMealsInDayForUserUsecaseRequest,
  ): Promise<MealDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllMealsInDayForUserUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );
    if (!day) {
      throw new NotFoundError(
        `GetAllMealsInDayForUserUsecase: Day with id ${request.dayId} not found`,
      );
    }

    const meals = await this.mealsRepo.getMealByIds(day.mealIds);

    return meals.map(toMealDTO);
  }
}
