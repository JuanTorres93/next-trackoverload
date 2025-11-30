import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { NotFoundError } from '@/domain/common/errors';

export type GetAllFakeMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllFakeMealsForUserUsecase {
  constructor(
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetAllFakeMealsForUserUsecaseRequest
  ): Promise<FakeMealDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllFakeMealsForUserUsecase: user with id ${request.userId} not found`
      );
    }

    const fakeMeals = await this.fakeMealsRepo.getAllFakeMealsByUserId(
      request.userId
    );

    return fakeMeals.map(toFakeMealDTO) || [];
  }
}
