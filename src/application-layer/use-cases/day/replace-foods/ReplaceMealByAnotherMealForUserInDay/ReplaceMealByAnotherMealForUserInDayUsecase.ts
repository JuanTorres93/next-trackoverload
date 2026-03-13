import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError } from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { createMealsFromRecipes } from '../../common/createMealsFromRecipes';

export type ReplaceMealByAnotherMealForUserInDayUsecaseRequest = {
  dayId: string;
  userId: string;
  mealToReplaceId: string;
  recipeId: string;
};

export class ReplaceMealByAnotherMealForUserInDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: ReplaceMealByAnotherMealForUserInDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, recipe, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.recipeId, request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `ReplaceMealByAnotherMealForUserInDayUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!recipe) {
      throw new NotFoundError(
        `ReplaceMealByAnotherMealForUserInDayUsecase: Recipe with id ${request.recipeId} not found`,
      );
    }

    if (!day) {
      throw new NotFoundError(
        `ReplaceMealByAnotherMealForUserInDayUsecase: Day with id ${request.dayId} not found for user ${request.userId}`,
      );
    }

    const [newMeal] = createMealsFromRecipes(
      [recipe as Recipe],
      request.userId,
      this.idGenerator,
    );

    day.removeMealById(request.mealToReplaceId);
    day.addMeal(newMeal.id);

    await this.transactionContext.run(async () => {
      await this.mealsRepo.deleteMeal(request.mealToReplaceId);
      await this.mealsRepo.saveMeal(newMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
