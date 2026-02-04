import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUnitOfWork } from '@/interface-adapters/app/repos/AppUnitOfWork';
import { RemoveFakeMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveFakeMealFromDay/RemoveFakeMealFromDay.usecase';

export const AppRemoveFakeMealFromDayUsecase = new RemoveFakeMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppFakeMealsRepo,
  AppUnitOfWork,
);
