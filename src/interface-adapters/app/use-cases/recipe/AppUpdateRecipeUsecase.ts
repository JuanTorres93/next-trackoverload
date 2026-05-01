import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateRecipeUsecase } from '@/application-layer/use-cases/recipe/UpdateRecipe/UpdateRecipe.usecase';

export const AppUpdateRecipeUsecase = new UpdateRecipeUsecase(
  AppRecipesRepo,
  AppUsersRepo
);
