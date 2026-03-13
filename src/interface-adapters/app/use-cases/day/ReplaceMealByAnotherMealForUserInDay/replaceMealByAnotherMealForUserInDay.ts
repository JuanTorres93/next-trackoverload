import { ReplaceMealByAnotherMealForUserInDayUsecase } from '@/application-layer/use-cases/day/replace-foods/ReplaceMealByAnotherMealForUserInDay/ReplaceMealByAnotherMealForUserInDayUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppReplaceMealByAnotherMealForUserInDayUsecase =
  new ReplaceMealByAnotherMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppMealsRepo,
    AppRecipesRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
