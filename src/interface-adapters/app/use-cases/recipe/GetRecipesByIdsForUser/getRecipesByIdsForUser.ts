import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { GetRecipesByIdsForUserUsecase } from '@/application-layer/use-cases/recipe/GetRecipesByIdsForUser/GetRecipesByIdsForUser.usecase';

export const AppGetRecipesByIdsForUserUsecase =
  new GetRecipesByIdsForUserUsecase(AppRecipesRepo);
