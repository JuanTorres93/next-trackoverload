import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetAllRecipesForUserUsecase } from '@/application-layer/use-cases/recipe/GetAllRecipesForUser/GetAllRecipesForUser.usecase';

export const AppGetAllRecipesForUserUsecase = new GetAllRecipesForUserUsecase(
  AppRecipesRepo,
  AppUsersRepo
);
