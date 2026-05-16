import { GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase } from '../../../../application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays =
  new GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase(
    AppDaysRepo,
    AppUsersRepo,
  );
