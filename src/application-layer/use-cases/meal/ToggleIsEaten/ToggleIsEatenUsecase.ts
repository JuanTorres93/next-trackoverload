import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type ToggleIsEatenUsecaseRequest = {
  mealId: string;
  userId: string;
};

export class ToggleIsEatenUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: ToggleIsEatenUsecaseRequest): Promise<MealDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `ToggleIsEatenUsecase: User with id ${request.userId} not found`,
      );
    }

    const meal = await this.mealsRepo.getMealByIdForUser(
      request.mealId,
      request.userId,
    );
    if (!meal) {
      throw new NotFoundError('ToggleIsEatenUsecase: Meal not found');
    }

    meal.toggleIsEaten();
    await this.mealsRepo.saveMeal(meal);

    return toMealDTO(meal);
  }
}
