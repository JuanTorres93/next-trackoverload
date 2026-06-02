import { MealDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { MealsRepo } from "../../../../domain/repos/MealsRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toMealDTO } from "../../../dtos/MealDTO";

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
    const [user, meal] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.mealsRepo.getMealByIdForUser(request.mealId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `ToggleIsEatenUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!meal) {
      logNoTest("ToggleIsEatenUsecase: Meal not found");

      throw new NotFoundError("La comida no existe.");
    }

    meal.toggleIsEaten();
    await this.mealsRepo.saveMeal(meal);

    return toMealDTO(meal);
  }
}
