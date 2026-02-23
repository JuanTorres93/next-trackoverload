import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
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

export type AddMultipleMealsToDayUsecaseRequest = {
  dayId: string;
  userId: string;
  recipeIds: string[];
};

export class AddMultipleMealsToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: AddMultipleMealsToDayUsecaseRequest): Promise<DayDTO> {
    // Fetch user and all recipes in parallel for efficiency
    const [user, ...recipes] = await Promise.all([
      this.usersRepo.getUserById(request.userId),
      ...request.recipeIds.map((recipeId) =>
        this.recipesRepo.getRecipeByIdAndUserId(recipeId, request.userId),
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `AddMultipleMealsToDayUsecase: user with id ${request.userId} not found`,
      );
    }

    for (let i = 0; i < request.recipeIds.length; i++) {
      if (!recipes[i]) {
        throw new NotFoundError(
          `AddMultipleMealsToDayUsecase: Recipe with id ${request.recipeIds[i]} not found`,
        );
      }
    }

    let dayToAddMeals = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );

    if (!dayToAddMeals) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToAddMeals = await createDayNoSaveInRepo(
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

    const meals = recipes.map((recipe) => {
      const newMealId = this.idGenerator.generateId();

      const mealIngredientLines = recipe!.ingredientLines.map((line) =>
        IngredientLine.create({
          id: this.idGenerator.generateId(),
          parentId: newMealId,
          parentType: 'meal',
          ingredient: line.ingredient,
          quantityInGrams: line.quantityInGrams,
        }),
      );

      return Meal.create({
        id: newMealId,
        userId: request.userId,
        name: recipe!.name,
        createdFromRecipeId: recipe!.id,
        ingredientLines: mealIngredientLines,
        imageUrl: recipe!.imageUrl,
      });
    });

    meals.forEach((meal) => dayToAddMeals!.addMeal(meal.id));

    await this.transactionContext.run(async () => {
      await this.mealsRepo.saveMultipleMeals(meals);
      await this.daysRepo.saveDay(dayToAddMeals!);
    });

    return toDayDTO(dayToAddMeals);
  }
}
