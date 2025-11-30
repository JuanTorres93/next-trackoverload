import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError, NotFoundError } from '@/domain/common/errors';

export type GetFakeMealsByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetFakeMealsByIdsForUserUsecase {
  constructor(
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetFakeMealsByIdsForUserUsecaseRequest
  ): Promise<FakeMealDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetFakeMealsByIdsForUserUsecase: user with id ${request.userId} not found`
      );
    }

    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetFakeMealsByIdsUsecase: ids must be a non-empty array'
      );
    }

    const uniqueIds = Array.from(new Set(request.ids));

    uniqueIds.forEach((id) => {
      validateNonEmptyString(id, `GetFakeMealsByIdsUsecase id ${id}`);
    });

    const fakeMeals = await Promise.all(
      uniqueIds.map((id) =>
        this.fakeMealsRepo.getFakeMealByIdAndUserId(id, request.userId)
      )
    );

    // Filter out null values (fake meals that weren't found)
    return fakeMeals
      .filter((fakeMeal): fakeMeal is FakeMeal => fakeMeal !== null)
      .map(toFakeMealDTO);
  }
}
