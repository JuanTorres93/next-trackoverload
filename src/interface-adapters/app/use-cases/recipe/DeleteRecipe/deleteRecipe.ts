import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { DeleteRecipeUsecase } from '@/application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(
  AppRecipesRepo,
  AppImagesRepo,
  AppUsersRepo
);
