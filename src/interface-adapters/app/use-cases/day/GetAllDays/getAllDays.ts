import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetAllDaysUsecase } from '@/application-layer/use-cases/day/GetAllDays/GetAllDays.usecase';

export const AppGetAllDaysUsecase = new GetAllDaysUsecase(
  AppDaysRepo,
  AppUsersRepo
);
