import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';
import { createMealsFromRecipes } from '../common/createMealsFromRecipes';

export type AddMealToDayUsecaseRequest = {
  dayId: string;
  userId: string;
  recipeId: string;
};

// TODO Manage images for meals created from recipes
export class AddMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
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
    const meal = createMealsFromRecipes(
      [recipe],
      request.userId,
      this.idGenerator,
    )[0];

    dayToAddMeal.addMeal(meal.id);

    await this.transactionContext.run(async () => {
      await this.mealsRepo.saveMeal(meal);
      await this.daysRepo.saveDay(dayToAddMeal);
    });

    return toDayDTO(dayToAddMeal);
  }
}
