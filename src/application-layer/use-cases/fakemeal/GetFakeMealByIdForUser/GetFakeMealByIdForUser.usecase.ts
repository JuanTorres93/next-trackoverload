import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { NotFoundError } from '@/domain/common/errors';

export type GetFakeMealByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetFakeMealByIdForUserUsecase {
  constructor(
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetFakeMealByIdForUserUsecaseRequest
  ): Promise<FakeMealDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetFakeMealByIdForUserUsecase: user with id ${request.userId} not found`
      );
    }

    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.id,
      request.userId
    );

    return fakeMeal ? toFakeMealDTO(fakeMeal) : null;
  }
}
