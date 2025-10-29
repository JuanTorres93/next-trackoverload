import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { RemoveMealFromDayUsecase } from '@/application-layer/use-cases/day/RemoveMealFromDay/RemoveMealFromDay.usecase';

export const AppRemoveMealFromDayUsecase = new RemoveMealFromDayUsecase(
  AppDaysRepo
);
