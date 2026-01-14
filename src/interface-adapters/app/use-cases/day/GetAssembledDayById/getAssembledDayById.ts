import { GetAssembledDayByIdUsecase } from '@/application-layer/use-cases/day/GetAssembledDayById/GetAssembledDayByIdUsecase';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppGetAssembledDayById = new GetAssembledDayByIdUsecase(
  AppDaysRepo,
  AppMealsRepo,
  AppFakeMealsRepo,
  AppUsersRepo
);
