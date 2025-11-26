import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal, MealUpdateProps } from '@/domain/entities/meal/Meal';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Id } from '@/domain/types/Id/Id';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateMealUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: UpdateMealUsecaseRequest): Promise<MealDTO> {
    validateNonEmptyString(request.id, 'UpdateMealUsecase id');
    validateNonEmptyString(request.userId, 'UpdateMealUsecase userId');

    const existingMeal = await this.mealsRepo.getMealByIdForUser(
      request.id,
      request.userId
    );

    if (!existingMeal) {
      throw new NotFoundError('UpdateMealUsecase: Meal not found');
    }

    const patch: MealUpdateProps = {};

    // NOTE: Validation is done in the entity's update method
    if (request.name !== undefined) patch.name = request.name;

    if (Object.keys(patch).length > 0) {
      // Create a new meal with the same properties
      const updatedMeal = Meal.create({
        id: Id.create(existingMeal.id),
        userId: existingMeal.userId,
        name: existingMeal.name,
        ingredientLines: existingMeal.ingredientLines,
        createdAt: existingMeal.createdAt,
        updatedAt: existingMeal.updatedAt,
      });
      // Apply the updates using the entity's update method
      updatedMeal.update(patch);

      await this.mealsRepo.saveMeal(updatedMeal);

      return toMealDTO(updatedMeal);
    }

    return toMealDTO(existingMeal); // No changes made, return the original
  }
}
