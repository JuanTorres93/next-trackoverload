import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';
import { createMealsFromRecipes } from '../common/createMealsFromRecipes';

export type AddMultipleMealsToMultipleDaysUsecaseRequest = {
  dayIds: string[];
  userId: string;
  recipeIds: string[];
};

export class AddMultipleMealsToMultipleDaysUsecase {
  static readonly MAX_DAYS = 14;
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: AddMultipleMealsToMultipleDaysUsecaseRequest,
  ): Promise<DayDTO[]> {
    if (
      request.dayIds.length > AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS
    ) {
      throw new ValidationError(
        `AddMultipleMealsToMultipleDaysUsecase: cannot process more than ${AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS} days at once`,
      );
    }

    // Fetch user and all recipes in parallel for efficiency
    const [user, ...recipes] = await Promise.all([
      this.usersRepo.getUserById(request.userId),
      ...request.recipeIds.map((recipeId) =>
        this.recipesRepo.getRecipeByIdAndUserId(recipeId, request.userId),
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `AddMultipleMealsToMultipleDaysUsecase: user with id ${request.userId} not found`,
      );
    }

    for (let i = 0; i < request.recipeIds.length; i++) {
      if (!recipes[i]) {
        throw new NotFoundError(
          `AddMultipleMealsToMultipleDaysUsecase: Recipe with id ${request.recipeIds[i]} not found`,
        );
      }
    }

    // Fetch or create each day in parallel
    const days = await this.getOrCreateDays(request.dayIds, request.userId);

    // For each day, create meals from recipes and register them on the day
    const allMeals = days.flatMap((day) => {
      const meals = createMealsFromRecipes(
        recipes as Recipe[],
        request.userId,
        this.idGenerator,
      );

      meals.forEach((meal) => day.addMeal(meal.id));

      return meals;
    });

    await this.transactionContext.run(async () => {
      await this.mealsRepo.saveMultipleMeals(allMeals);
      await this.daysRepo.saveMultipleDays(days);
    });

    return days.map(toDayDTO);
  }

  // TODO Susceptible to optimization by fetching all days for the user and then processing accordingly
  private async getOrCreateDays(
    dayIds: string[],
    userId: string,
  ): Promise<Day[]> {
    return Promise.all(
      dayIds.map(async (dayId) => {
        const existingDay = await this.daysRepo.getDayByIdAndUserId(
          dayId,
          userId,
        );

        if (existingDay) return existingDay;

        const { day, month, year } = dayIdToDayMonthYear(dayId);

        return createDayNoSaveInRepo(this.usersRepo, this.daysRepo, {
          day,
          month,
          year,
          actorUserId: userId,
          targetUserId: userId,
        });
      }),
    );
  }
}
