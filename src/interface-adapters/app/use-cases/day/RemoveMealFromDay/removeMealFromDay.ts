import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUnitOfWork } from '@/interface-adapters/app/repos/AppUnitOfWork';
import { RemoveMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveMealFromDay/RemoveMealFromDay.usecase';

export const AppRemoveMealFromDayUsecase = new RemoveMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppMealsRepo,
  AppUnitOfWork,
);
