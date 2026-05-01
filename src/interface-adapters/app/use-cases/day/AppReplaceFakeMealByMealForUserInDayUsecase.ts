import { ReplaceFakeMealByMealForUserInDayUsecase } from '@/application-layer/use-cases/day/replace-foods/ReplaceFakeMealByMealForUserInDay/ReplaceFakeMealByMealForUserInDayUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

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
