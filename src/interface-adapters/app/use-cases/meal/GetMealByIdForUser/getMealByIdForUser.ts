import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetMealByIdForUserUsecase } from '@/application-layer/use-cases/meal/GetMealByIdForUser/GetMealByIdForUser.usecase';

export const AppGetMealByIdForUserUsecase = new GetMealByIdForUserUsecase(
  AppMealsRepo,
  AppUsersRepo
);
