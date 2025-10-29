import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { GetDayNutritionalSummaryUsecase } from '@/application-layer/use-cases/day/GetDayNutritionalSummary/GetDayNutritionalSummary.usecase';

export const AppGetDayNutritionalSummaryUsecase =
  new GetDayNutritionalSummaryUsecase(AppDaysRepo);
