import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { GetAllMealsForUserUsecase } from '@/application-layer/use-cases/meal/GetAllMealsForUser/GetAllMealsForUser.usecase';

export const AppGetAllMealsForUserUsecase = new GetAllMealsForUserUsecase(
  AppMealsRepo
);
