import { RemoveMealFromDayUsecase } from '../../../../application-layer/use-cases/day/RemoveMealFromDay/RemoveMealFromDay.usecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppRemoveMealFromDayUsecase = new RemoveMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppMealsRepo,
  AppTransactionContext,
);
