import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealUpdateProps } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type UpdateMealUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: UpdateMealUsecaseRequest): Promise<MealDTO> {
    const existingMeal = await this.mealsRepo.getMealByIdForUser(
      request.id,
      request.userId
    );

    if (!existingMeal) {
      throw new NotFoundError('UpdateMealUsecase: Meal not found');
    }

    const patch: MealUpdateProps = {
      name: request.name,
    };

    existingMeal.update(patch);

    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
