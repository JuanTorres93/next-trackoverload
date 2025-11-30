import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateMealUsecase } from '@/application-layer/use-cases/meal/UpdateMeal/UpdateMeal.usecase';

export const AppUpdateMealUsecase = new UpdateMealUsecase(
  AppMealsRepo,
  AppUsersRepo
);
