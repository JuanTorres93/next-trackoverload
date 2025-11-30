import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetRecipesByIdsForUserUsecase } from '@/application-layer/use-cases/recipe/GetRecipesByIdsForUser/GetRecipesByIdsForUser.usecase';

export const AppGetRecipesByIdsForUserUsecase =
  new GetRecipesByIdsForUserUsecase(AppRecipesRepo, AppUsersRepo);
