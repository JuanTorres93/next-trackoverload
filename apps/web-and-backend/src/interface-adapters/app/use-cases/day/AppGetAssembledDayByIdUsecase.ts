import { GetAssembledDayByIdUsecase } from '../../../../application-layer/use-cases/day/GetAssembledDayById/GetAssembledDayByIdUsecase';

import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppGetAssembledDayById = new GetAssembledDayByIdUsecase(
  AppDaysRepo,
  AppMealsRepo,
  AppFakeMealsRepo,
  AppUsersRepo
);
