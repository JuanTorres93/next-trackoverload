import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError } from '@/domain/common/errors';

export type GetMealsByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetMealsByIdsForUserUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: GetMealsByIdsForUserUsecaseRequest): Promise<Meal[]> {
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

    // Filter out null values (meals that weren't found)
    return meals.filter((meal): meal is Meal => meal !== null);
  }
}
