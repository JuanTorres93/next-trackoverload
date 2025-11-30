import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetDayNutritionalSummaryUsecase } from '@/application-layer/use-cases/day/GetDayNutritionalSummary/GetDayNutritionalSummary.usecase';

export const AppGetDayNutritionalSummaryUsecase =
  new GetDayNutritionalSummaryUsecase(AppDaysRepo, AppUsersRepo);
