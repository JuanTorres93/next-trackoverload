import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealUpdateProps } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type UpdateMealUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateMealUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: UpdateMealUsecaseRequest): Promise<MealDTO> {
    const [user, existingMeal] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.mealsRepo.getMealByIdForUser(request.id, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `UpdateMealUsecase: user with id ${request.userId} not found`,
      );
    }

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
