import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetMealByIdForUserUsecaseRequest = {
  userId: string;
  mealId: string;
};

export class GetMealByIdForUserUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetMealByIdForUserUsecaseRequest
  ): Promise<MealDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError('GetMealByIdForUserUsecase: User not found');
    }

    const meal = await this.mealsRepo.getMealByIdForUser(
      request.mealId,
      request.userId
    );

    return meal ? toMealDTO(meal) : null;
  }
}
