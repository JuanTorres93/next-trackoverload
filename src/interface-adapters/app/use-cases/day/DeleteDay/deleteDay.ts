import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';

import { DeleteDayUsecase } from '@/application-layer/use-cases/day/DeleteDay/DeleteDay.usecase';

export const AppDeleteDayUsecase = new DeleteDayUsecase(
  AppDaysRepo,
  AppUsersRepo,
  AppMealsRepo,
  AppFakeMealsRepo
);
