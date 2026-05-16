import { ReplaceFakeMealByMealForUserInDayUsecase } from '../../../../application-layer/use-cases/day/replace-foods/ReplaceFakeMealByMealForUserInDay/ReplaceFakeMealByMealForUserInDayUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppReplaceFakeMealByMealForUserInDayUsecase =
  new ReplaceFakeMealByMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppMealsRepo,
    AppFakeMealsRepo,
    AppRecipesRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
