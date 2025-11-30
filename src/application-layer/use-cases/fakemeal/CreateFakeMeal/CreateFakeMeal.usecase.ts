import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

export type CreateFakeMealUsecaseRequest = {
  userId: string;
  name: string;
  calories: number;
  protein: number;
};

export class CreateFakeMealUsecase {
  constructor(
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(request: CreateFakeMealUsecaseRequest): Promise<FakeMealDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateFakeMealUsecase: user with id ${request.userId} not found`
      );
    }

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
