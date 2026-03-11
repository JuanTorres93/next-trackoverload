import { GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays =
  new GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase(
    AppDaysRepo,
    AppUsersRepo,
  );
