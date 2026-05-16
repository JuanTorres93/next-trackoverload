import { ReplaceMealByFakeMealForUserInDayUsecase } from '../../../../application-layer/use-cases/day/replace-foods/ReplaceMealByFakeMealForUserInDay/ReplaceMealByFakeMealForUserInDayUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppReplaceMealByFakeMealForUserInDayUsecase =
  new ReplaceMealByFakeMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppMealsRepo,
    AppFakeMealsRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
