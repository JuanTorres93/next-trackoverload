import { SetCaloriesGoalForDayAndUserUsecase } from '@/application-layer/use-cases/day/SetCaloriesGoalForDayAndUser/SetCaloriesGoalForDayAndUserUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppSetCaloriesGoalForDayAndUserUsecase =
  new SetCaloriesGoalForDayAndUserUsecase(AppDaysRepo, AppUsersRepo);
