import { validateNonEmptyString } from '@/domain/common/validation';
import { Meal } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type GetAllMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllMealsForUserUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: GetAllMealsForUserUsecaseRequest): Promise<Meal[]> {
    validateNonEmptyString(request.userId, 'GetAllMealsForUser userId');

    const meals = await this.mealsRepo.getAllMealsForUser(request.userId);

    return meals || [];
  }
}
