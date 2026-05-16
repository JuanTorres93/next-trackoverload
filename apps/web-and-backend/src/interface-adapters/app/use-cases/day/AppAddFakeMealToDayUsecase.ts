import { AddFakeMealToDayUsecase } from '../../../../application-layer/use-cases/day/AddFakeMealToDay/AddFakeMealToDay.usecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppAddFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
  AppDaysRepo,
  AppFakeMealsRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppTransactionContext,
);
