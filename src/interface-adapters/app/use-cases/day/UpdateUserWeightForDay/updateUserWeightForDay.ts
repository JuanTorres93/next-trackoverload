import { UpdateUserWeightForDayUsecase } from '@/application-layer/use-cases/day/UpdateUserWeightForDay/UpdateUserWeightForDayUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppUpdateUserWeightForDayUsecase =
  new UpdateUserWeightForDayUsecase(AppDaysRepo, AppUsersRepo);
