import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AddMealToDayUsecase } from '@/application-layer/use-cases/day/AddMealToDay/AddMealToDay.usecase';

export const AppAddMealToDayUsecase = new AddMealToDayUsecase(
  AppDaysRepo,
  AppMealsRepo
);
