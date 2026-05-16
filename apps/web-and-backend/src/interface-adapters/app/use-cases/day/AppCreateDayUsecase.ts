import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { CreateDayUsecase } from '../../../../application-layer/use-cases/day/CreateDay/CreateDay.usecase';

export const AppCreateDayUsecase = new CreateDayUsecase(
  AppDaysRepo,
  AppUsersRepo
);
