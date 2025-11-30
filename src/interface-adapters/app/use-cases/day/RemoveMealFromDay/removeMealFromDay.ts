import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { RemoveMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveMealFromDay/RemoveMealFromDay.usecase';

export const AppRemoveMealFromDayUsecase = new RemoveMealFromDayUsecase(
  AppDaysRepo,
  AppUsersRepo
);
