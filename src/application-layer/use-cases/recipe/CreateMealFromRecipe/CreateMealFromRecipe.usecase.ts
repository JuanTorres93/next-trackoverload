import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Meal } from '@/domain/entities/meal/Meal';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type CreateMealFromRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  mealName?: string;
};

export class CreateMealFromRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(request: CreateMealFromRecipeUsecaseRequest): Promise<MealDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateMealFromRecipeUsecase: user with id ${request.userId} not found`
      );
    }
    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );
    if (!recipe) {
      throw new NotFoundError(
        `CreateMealFromRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    const mealName = request.mealName || recipe.name;

    const newMeal = Meal.create({
      id: uuidv4(),
      userId: request.userId,
      name: mealName,
      ingredientLines: recipe.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.mealsRepo.saveMeal(newMeal);

    return toMealDTO(newMeal);
  }
}
