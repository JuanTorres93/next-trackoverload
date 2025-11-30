import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetDayByIdUsecase } from '@/application-layer/use-cases/day/GetDayById/GetDayById.usecase';

export const AppGetDayByIdUsecase = new GetDayByIdUsecase(
  AppDaysRepo,
  AppUsersRepo
);
