import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppImageManager } from '@/interface-adapters/app/services/AppImageManager';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { DeleteRecipeUsecase } from '@/application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(
  AppRecipesRepo,
  AppImageManager,
  AppUsersRepo
);
