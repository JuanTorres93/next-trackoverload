import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError } from '@/domain/common/errors';

export type GetMealsByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetMealsByIdsForUserUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(
    request: GetMealsByIdsForUserUsecaseRequest
  ): Promise<MealDTO[]> {
    validateNonEmptyString(request.userId, 'GetMealsByIdsUsecase userId');

    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetMealsByIdsUsecase: ids must be a non-empty array'
      );
    }

    const uniqueIds = Array.from(new Set(request.ids));

    uniqueIds.forEach((id) => {
      validateNonEmptyString(id, `GetMealsByIdsUsecase id  ${id}`);
    });

    const meals = await Promise.all(
      uniqueIds.map((id) =>
        this.mealsRepo.getMealByIdForUser(id, request.userId)
      )
    );

    // Filter out null values (meals that weren't found) and convert to DTOs
    return meals.filter((meal) => meal !== null).map(toMealDTO);
  }
}
