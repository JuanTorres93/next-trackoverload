import { v4 as uuidv4 } from 'uuid';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { stringDayIdToDate } from '@/domain/value-objects/DayId/DayId';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';

export type AddMealToDayUsecaseRequest = {
  date: string;
  userId: string;
  recipeId: string;
};

export class AddMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo
  ) {}

  async execute(request: AddMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddMealToDayUsecase: user with id ${request.userId} not found`
      );
    }

    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );

    if (!recipe) {
      throw new NotFoundError(
        `AddMealToDayUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    let day = await this.daysRepo.getDayByIdAndUserId(
      request.date,
      request.userId
    );

    if (!day) {
      day = Day.create({
        id: stringDayIdToDate(request.date),
        userId: request.userId,
        meals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const newMealId = uuidv4();

    const mealIngredientLines = recipe.ingredientLines.map((line) =>
      IngredientLine.create({
        id: uuidv4(),
        parentId: newMealId,
        parentType: 'meal',
        ingredient: line.ingredient,
        quantityInGrams: line.quantityInGrams,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    const meal = Meal.create({
      id: newMealId,
      userId: request.userId,
      name: recipe.name,
      ingredientLines: mealIngredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    day.addMeal(meal);

    await this.mealsRepo.saveMeal(meal);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
