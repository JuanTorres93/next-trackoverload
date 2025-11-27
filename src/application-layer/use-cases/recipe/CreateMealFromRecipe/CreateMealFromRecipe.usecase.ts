import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { Id } from '@/domain/types/Id/Id';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

export type CreateMealFromRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  mealName?: string;
};

export class CreateMealFromRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo, private mealsRepo: MealsRepo) {}

  async execute(request: CreateMealFromRecipeUsecaseRequest): Promise<MealDTO> {
    validateNonEmptyString(
      request.recipeId,
      'CreateMealFromRecipeUsecase recipeId'
    );
    validateNonEmptyString(
      request.userId,
      'CreateMealFromRecipeUsecase userId'
    );

    if (request.mealName !== undefined)
      validateNonEmptyString(
        request.mealName,
        'CreateMealFromRecipeUsecase mealName'
      );

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
      id: Id.create(uuidv4()),
      userId: Id.create(request.userId),
      name: mealName,
      ingredientLines: recipe.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.mealsRepo.saveMeal(newMeal);

    return toMealDTO(newMeal);
  }
}
