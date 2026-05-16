import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { GetLastDayWithCaloriesGoalForUserUsecase } from '../../../../application-layer/use-cases/day/GetLastDayWithCaloriesGoalForUser/GetLastDayWithCaloriesGoalForUser.usecase';

export const AppGetLastDayWithCaloriesGoalForUserUsecase =
  new GetLastDayWithCaloriesGoalForUserUsecase(AppDaysRepo, AppUsersRepo);
