import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetAllMealsForUserUsecase } from '@/application-layer/use-cases/meal/GetAllMealsForUser/GetAllMealsForUser.usecase';

export const AppGetAllMealsForUserUsecase = new GetAllMealsForUserUsecase(
  AppMealsRepo,
  AppUsersRepo
);
