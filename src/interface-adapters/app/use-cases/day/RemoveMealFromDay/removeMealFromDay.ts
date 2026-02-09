import { RemoveMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveMealFromDay/RemoveMealFromDay.usecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppRemoveMealFromDayUsecase = new RemoveMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppMealsRepo,
  AppTransactionContext,
);
