import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError } from '@/domain/common/errors';

export type GetFakeMealsByIdsUsecaseRequest = {
  ids: string[];
};

export class GetFakeMealsByIdsUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: GetFakeMealsByIdsUsecaseRequest): Promise<FakeMeal[]> {
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
      uniqueIds.map((id) => this.fakeMealsRepo.getFakeMealById(id))
    );

    // Filter out null values (fake meals that weren't found)
    return fakeMeals.filter(
      (fakeMeal): fakeMeal is FakeMeal => fakeMeal !== null
    );
  }
}
