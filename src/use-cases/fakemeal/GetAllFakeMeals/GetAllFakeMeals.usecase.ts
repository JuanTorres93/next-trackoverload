import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

export class GetAllFakeMealsUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(): Promise<FakeMeal[]> {
    const fakeMeals = await this.fakeMealsRepo.getAllFakeMeals();

    return fakeMeals || [];
  }
}
