import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type AddIngredientToMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientId: string;
  quantityInGrams: number;
};

export class AddIngredientToMealUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private ingredientsRepo: IngredientsRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: AddIngredientToMealUsecaseRequest): Promise<MealDTO> {
    const [user, existingMeal, ingredient] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.mealsRepo.getMealByIdForUser(request.mealId, request.userId),

      this.ingredientsRepo.getIngredientById(request.ingredientId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: user with id ${request.userId} not found`,
      );
    }

    if (!existingMeal) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: Meal with id ${request.mealId} not found`,
      );
    }

    if (!ingredient) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: Ingredient with id ${request.ingredientId} not found`,
      );
    }

    const newIngredientLine = IngredientLine.create({
      id: this.idGenerator.generateId(),
      parentId: request.mealId,
      parentType: 'meal',
      ingredient: ingredient,
      quantityInGrams: request.quantityInGrams,
    });

    existingMeal.addIngredientLine(newIngredientLine);
    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
