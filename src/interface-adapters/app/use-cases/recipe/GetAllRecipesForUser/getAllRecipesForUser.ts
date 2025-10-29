import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { GetAllRecipesForUserUsecase } from '@/application-layer/use-cases/recipe/GetAllRecipesForUser/GetAllRecipesForUser.usecase';

export const AppGetAllRecipesForUserUsecase = new GetAllRecipesForUserUsecase(
  AppRecipesRepo
);
