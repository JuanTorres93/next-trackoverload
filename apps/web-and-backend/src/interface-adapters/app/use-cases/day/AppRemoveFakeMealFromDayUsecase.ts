import { RemoveFakeMealFromDayUsecase } from '../../../../application-layer/use-cases/day/RemoveFakeMealFromDay/RemoveFakeMealFromDay.usecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppRemoveFakeMealFromDayUsecase = new RemoveFakeMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppFakeMealsRepo,
  AppTransactionContext,
);
