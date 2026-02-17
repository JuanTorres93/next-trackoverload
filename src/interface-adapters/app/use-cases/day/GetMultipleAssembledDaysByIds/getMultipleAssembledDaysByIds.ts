import { GetMultipleAssembledDaysByIdsUsecase } from '@/application-layer/use-cases/day/GetMultipleAssembledDaysByIds/GetMultipleAssembledDaysByIdsUsecase';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppGetMultipleAssembledDaysByIds =
  new GetMultipleAssembledDaysByIdsUsecase(
    AppDaysRepo,
    AppMealsRepo,
    AppFakeMealsRepo,
    AppUsersRepo,
  );
