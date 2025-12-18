import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AddMealToDayUsecase } from '@/application-layer/use-cases/day/AddMealToDay/AddMealToDay.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppAddMealToDayUsecase = new AddMealToDayUsecase(
  AppDaysRepo,
  AppMealsRepo,
  AppUsersRepo,
  AppRecipesRepo,
  AppUuidV4IdGenerator
);
