import { RemoveFakeMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveFakeMealFromDay/RemoveFakeMealFromDay.usecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppRemoveFakeMealFromDayUsecase = new RemoveFakeMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppFakeMealsRepo,
  AppTransactionContext,
);
