import { ReplaceMealByAnotherMealForUserInDayUsecase } from '../../../../application-layer/use-cases/day/replace-foods/ReplaceMealByAnotherMealForUserInDay/ReplaceMealByAnotherMealForUserInDayUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppReplaceMealByAnotherMealForUserInDayUsecase =
  new ReplaceMealByAnotherMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppMealsRepo,
    AppRecipesRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
