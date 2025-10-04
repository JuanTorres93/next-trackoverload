import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type DeleteMealUsecaseRequest = {
  id: string;
};

export class DeleteMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: DeleteMealUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteMealUsecase');

    // Search meal
    const meal = await this.mealsRepo.getMealById(request.id);

    if (!meal) {
      throw new NotFoundError('DeleteMealUsecase: Meal not found');
    }

    await this.mealsRepo.deleteMeal(request.id);
  }
}
