import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';

export type AddMealToDayUsecaseRequest = {
  dayId: string;
  userId: string;
  recipeId: string;
};

export class AddMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: AddMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddMealToDayUsecase: user with id ${request.userId} not found`,
      );
    }

    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId,
    );

    if (!recipe) {
      throw new NotFoundError(
        `AddMealToDayUsecase: Recipe with id ${request.recipeId} not found`,
      );
    }

    let dayToAddMeal = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );

    if (!dayToAddMeal) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToAddMeal = await createDayNoSaveInRepo(
        this.usersRepo,
        this.daysRepo,
        {
          day,
          month,
          year,
          actorUserId: request.userId,
          targetUserId: request.userId,
        },
      );
    }

    const newMealId = this.idGenerator.generateId();

    const mealIngredientLines = recipe.ingredientLines.map((line) =>
      IngredientLine.create({
        id: this.idGenerator.generateId(),
        parentId: newMealId,
        parentType: 'meal',
        ingredient: line.ingredient,
        quantityInGrams: line.quantityInGrams,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const meal = Meal.create({
      id: newMealId,
      userId: request.userId,
      name: recipe.name,
      createdFromRecipeId: recipe.id,
      ingredientLines: mealIngredientLines,
      imageUrl: recipe.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    dayToAddMeal.addMeal(meal.id);

    await this.mealsRepo.saveMeal(meal);
    await this.daysRepo.saveDay(dayToAddMeal);

    return toDayDTO(dayToAddMeal);
  }
}
