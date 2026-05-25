import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { Day } from "../../../../domain/entities/day/Day";
import { Recipe } from "../../../../domain/entities/recipe/Recipe";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { MealsRepo } from "../../../../domain/repos/MealsRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { IdGenerator } from "../../../../domain/services/IdGenerator.port";
import { dayIdToDayMonthYear } from "../../../../domain/value-objects/DayId/DayId";
import { DayDTO, toDayDTO } from "../../../dtos/DayDTO";
import { TransactionContext } from "../../../ports/TransactionContext.port";
import { createDayNoSaveInRepo } from "../common/createDayNoSaveInRepo";
import { createMealsFromRecipes } from "../common/createMealsFromRecipes";

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
    const [user, existingDay, ...recipes] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),

      ...request.recipeIds.map((recipeId) =>
        this.recipesRepo.getRecipeByIdAndUserId(recipeId, request.userId),
      ),
    ]);

    if (!user) {
      logNoTest(
        `AddMultipleMealsToDayUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    for (let i = 0; i < request.recipeIds.length; i++) {
      if (!recipes[i]) {
        logNoTest(
          `AddMultipleMealsToDayUsecase: Recipe with id ${request.recipeIds[i]} not found for user with id ${request.userId}`,
        );

        throw new NotFoundError("La receta no existe.");
      }
    }

    let dayToAddMeals = existingDay as Day | null;

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

    const meals = createMealsFromRecipes(
      recipes as Recipe[],
      request.userId,
      this.idGenerator,
    );

    meals.forEach((meal) => dayToAddMeals!.addMeal(meal.id));

    await this.transactionContext.run(async () => {
      await this.mealsRepo.saveMultipleMeals(meals);
      await this.daysRepo.saveDay(dayToAddMeals!);
    });

    return toDayDTO(dayToAddMeals);
  }
}
