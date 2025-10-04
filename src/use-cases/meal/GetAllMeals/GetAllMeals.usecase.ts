import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';

export class GetAllMealsUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(): Promise<Meal[]> {
    const meals = await this.mealsRepo.getAllMeals();

    return meals || [];
  }
}
