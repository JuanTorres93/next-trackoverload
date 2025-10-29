import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { GetMealsByIdsForUserUsecase } from '@/application-layer/use-cases/meal/GetMealsByIdsForUser/GetMealsByIdsForUser.usecase';

export const AppGetMealsByIdsForUserUsecase = new GetMealsByIdsForUserUsecase(
  AppMealsRepo
);
