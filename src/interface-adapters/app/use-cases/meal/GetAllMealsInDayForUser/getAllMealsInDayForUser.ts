import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

import { GetAllMealsInDayForUserUsecase } from '@/application-layer/use-cases/meal/GetAllMealsInDayForUser/GetAllMealsInDayForUserUsecase';

export const AppGetAllMealsInDayForUserUsecase =
  new GetAllMealsInDayForUserUsecase(AppMealsRepo, AppDaysRepo, AppUsersRepo);
