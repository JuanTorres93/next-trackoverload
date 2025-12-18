import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AddFakeMealToDayUsecase } from '@/application-layer/use-cases/day/AddFakeMealToDay/AddFakeMealToDay.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppAddFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
  AppDaysRepo,
  AppFakeMealsRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator
);
