import { SetCaloriesGoalForDayAndUserUsecase } from '../../../../application-layer/use-cases/day/SetCaloriesGoalForDayAndUser/SetCaloriesGoalForDayAndUserUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppSetCaloriesGoalForDayAndUserUsecase =
  new SetCaloriesGoalForDayAndUserUsecase(AppDaysRepo, AppUsersRepo);
