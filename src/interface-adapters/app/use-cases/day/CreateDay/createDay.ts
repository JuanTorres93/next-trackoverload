import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { CreateDayUsecase } from '@/application-layer/use-cases/day/CreateDay/CreateDay.usecase';

export const AppCreateDayUsecase = new CreateDayUsecase(
  AppDaysRepo,
  AppUsersRepo
);
