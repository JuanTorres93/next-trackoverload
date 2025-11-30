import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { DeleteMealUsecase } from '@/application-layer/use-cases/meal/DeleteMeal/DeleteMeal.usecase';

export const AppDeleteMealUsecase = new DeleteMealUsecase(
  AppMealsRepo,
  AppUsersRepo
);
