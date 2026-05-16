import { ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from '../../../../application-layer/use-cases/day/replace-foods/ReplaceFakeMealByAnotherFakeMealForUserInDay/ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase =
  new ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase(
    AppDaysRepo,
    AppUsersRepo,
    AppFakeMealsRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
