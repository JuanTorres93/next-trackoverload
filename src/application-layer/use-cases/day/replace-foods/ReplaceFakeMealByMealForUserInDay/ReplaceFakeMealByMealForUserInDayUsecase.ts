import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError } from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { createMealsFromRecipes } from '../../common/createMealsFromRecipes';

export type ReplaceFakeMealByMealForUserInDayUsecaseRequest = {
  fakeMealIdToReplace: string;
  dayId: string;
  userId: string;
  recipeId: string;
};

export class ReplaceFakeMealByMealForUserInDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private recipesRepo: RecipesRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: ReplaceFakeMealByMealForUserInDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, recipe, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.recipeId, request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `ReplaceFakeMealByMealForUserInDayUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!recipe) {
      throw new NotFoundError(
        `ReplaceFakeMealByMealForUserInDayUsecase: Recipe with id ${request.recipeId} not found`,
      );
    }

    if (!day) {
      throw new NotFoundError(
        `ReplaceFakeMealByMealForUserInDayUsecase: Day with id ${request.dayId} not found for user ${request.userId}`,
      );
    }

    const [newMeal] = createMealsFromRecipes(
      [recipe as Recipe],
      request.userId,
      this.idGenerator,
    );

    day.removeFakeMealById(request.fakeMealIdToReplace);
    day.addMeal(newMeal.id);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealIdToReplace);
      await this.mealsRepo.saveMeal(newMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
