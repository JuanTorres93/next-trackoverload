import { GetMultipleAssembledDaysByIdsUsecase } from '../../../../application-layer/use-cases/day/GetMultipleAssembledDaysByIds/GetMultipleAssembledDaysByIdsUsecase';

import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppGetMultipleAssembledDaysByIds =
  new GetMultipleAssembledDaysByIdsUsecase(
    AppDaysRepo,
    AppMealsRepo,
    AppFakeMealsRepo,
    AppUsersRepo,
  );
