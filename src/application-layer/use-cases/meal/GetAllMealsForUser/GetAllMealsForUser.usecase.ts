import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type GetAllMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllMealsForUserUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: GetAllMealsForUserUsecaseRequest): Promise<MealDTO[]> {
    const meals = await this.mealsRepo.getAllMealsForUser(request.userId);

    return meals.map(toMealDTO) || [];
  }
}
