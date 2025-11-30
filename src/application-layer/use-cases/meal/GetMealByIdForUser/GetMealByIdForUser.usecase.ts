import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetMealByIdUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetMealByIdForUserUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(request: GetMealByIdUsecaseRequest): Promise<MealDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetMealByIdForUserUsecase: user with id ${request.userId} not found`
      );
    }

    const meal = await this.mealsRepo.getMealById(request.id);

    if (meal && meal.userId !== request.userId) {
      throw new AuthError('You are not allowed to access this meal');
    }

    return meal ? toMealDTO(meal) : null;
  }
}
