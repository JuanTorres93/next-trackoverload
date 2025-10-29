import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { GetMealByIdForUserUsecase } from '@/application-layer/use-cases/meal/GetMealByIdForUser/GetMealByIdForUser.usecase';

export const AppGetMealByIdForUserUsecase = new GetMealByIdForUserUsecase(
  AppMealsRepo
);
