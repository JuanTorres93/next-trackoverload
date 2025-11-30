import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type AddIngredientToMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientId: string;
  quantityInGrams: number;
};

export class AddIngredientToMealUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private ingredientsRepo: IngredientsRepo
  ) {}

  async execute(request: AddIngredientToMealUsecaseRequest): Promise<MealDTO> {
    const existingMeal = await this.mealsRepo.getMealById(request.mealId);
    if (!existingMeal) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: Meal with id ${request.mealId} not found`
      );
    }

    if (existingMeal.userId !== request.userId) {
      throw new AuthError(
        'AddIngredientToMealUsecase: User not authorized to modify this meal'
      );
    }

    const ingredient = await this.ingredientsRepo.getIngredientById(
      request.ingredientId
    );
    if (!ingredient) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: Ingredient with id ${request.ingredientId} not found`
      );
    }

    const newIngredientLine = IngredientLine.create({
      id: uuidv4(),
      parentId: request.mealId,
      parentType: 'meal',
      ingredient: ingredient,
      quantityInGrams: request.quantityInGrams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    existingMeal.addIngredientLine(newIngredientLine);
    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
