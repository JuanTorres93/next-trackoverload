import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type CreateFakeMealUsecaseRequest = {
  userId: string;
  name: string;
  calories: number;
  protein: number;
};

export class CreateFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: CreateFakeMealUsecaseRequest): Promise<FakeMealDTO> {
    // NOTE: Validation is done in the entity
    const fakeMeal = FakeMeal.create({
      id: uuidv4(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.fakeMealsRepo.saveFakeMeal(fakeMeal);

    return toFakeMealDTO(fakeMeal);
  }
}
