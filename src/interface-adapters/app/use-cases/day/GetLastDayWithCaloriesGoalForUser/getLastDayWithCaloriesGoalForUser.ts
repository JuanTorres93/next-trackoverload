import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetLastDayWithCaloriesGoalForUserUsecase } from '@/application-layer/use-cases/day/GetLastDayWithCaloriesGoalForUser/GetLastDayWithCaloriesGoalForUser.usecase';

export const AppGetLastDayWithCaloriesGoalForUserUsecase =
  new GetLastDayWithCaloriesGoalForUserUsecase(AppDaysRepo, AppUsersRepo);
