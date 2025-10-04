import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type CreateFakeMealUsecaseRequest = {
  name: string;
  calories: number;
  protein: number;
};

export class CreateFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: CreateFakeMealUsecaseRequest): Promise<FakeMeal> {
    // NOTE: Validation is done in the entity
    const fakeMeal = FakeMeal.create({
      id: uuidv4(),
      name: request.name,
      calories: request.calories,
      protein: request.protein,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.fakeMealsRepo.saveFakeMeal(fakeMeal);

    return fakeMeal;
  }
}
