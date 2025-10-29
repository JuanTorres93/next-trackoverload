import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { GetRecipeByIdForUserUsecase } from '@/application-layer/use-cases/recipe/GetRecipeByIdForUser/GetRecipeByIdForUser.usecase';

export const AppGetRecipeByIdForUserUsecase = new GetRecipeByIdForUserUsecase(
  AppRecipesRepo
);
