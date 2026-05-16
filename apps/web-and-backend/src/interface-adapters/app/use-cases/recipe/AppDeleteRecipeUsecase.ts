import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppImagesRepo } from '../../repos/AppImagesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { DeleteRecipeUsecase } from '../../../../application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(
  AppRecipesRepo,
  AppImagesRepo,
  AppUsersRepo
);
