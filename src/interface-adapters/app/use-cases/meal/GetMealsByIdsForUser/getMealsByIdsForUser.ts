import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetMealsByIdsForUserUsecase } from '@/application-layer/use-cases/meal/GetMealsByIdsForUser/GetMealsByIdsForUser.usecase';

export const AppGetMealsByIdsForUserUsecase = new GetMealsByIdsForUserUsecase(
  AppMealsRepo,
  AppUsersRepo
);
