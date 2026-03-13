import { ReplaceMealByFakeMealForUserInDayUsecase } from '@/application-layer/use-cases/day/replace-foods/ReplaceMealByFakeMealForUserInDay/ReplaceMealByFakeMealForUserInDayUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppReplaceMealByFakeMealForUserInDayUsecase =
  new ReplaceMealByFakeMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppMealsRepo,
    AppFakeMealsRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
