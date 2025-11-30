import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetMealsByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetMealsByIdsForUserUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetMealsByIdsForUserUsecaseRequest
  ): Promise<MealDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetMealsByIdsForUserUsecase: user with id ${request.userId} not found`
      );
    }

    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetMealsByIdsUsecase: ids must be a non-empty array'
      );
    }

    const uniqueIds = Array.from(new Set(request.ids));

    const meals = await Promise.all(
      uniqueIds.map((id) =>
        this.mealsRepo.getMealByIdForUser(id, request.userId)
      )
    );

    // Filter out null values (meals that weren't found) and convert to DTOs
    return meals.filter((meal) => meal !== null).map(toMealDTO);
  }
}
