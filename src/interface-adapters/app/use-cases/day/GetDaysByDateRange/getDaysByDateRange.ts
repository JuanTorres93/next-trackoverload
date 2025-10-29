import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { GetDaysByDateRangeUsecase } from '@/application-layer/use-cases/day/GetDaysByDateRange/GetDaysByDateRange.usecase';

export const AppGetDaysByDateRangeUsecase = new GetDaysByDateRangeUsecase(
  AppDaysRepo
);
