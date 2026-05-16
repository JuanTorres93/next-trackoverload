import { UpdateUserWeightForDayUsecase } from '../../../../application-layer/use-cases/day/UpdateUserWeightForDay/UpdateUserWeightForDayUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppUpdateUserWeightForDayUsecase =
  new UpdateUserWeightForDayUsecase(AppDaysRepo, AppUsersRepo);
