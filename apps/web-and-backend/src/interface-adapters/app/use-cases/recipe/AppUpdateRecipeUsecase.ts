import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { UpdateRecipeUsecase } from '../../../../application-layer/use-cases/recipe/UpdateRecipe/UpdateRecipe.usecase';

export const AppUpdateRecipeUsecase = new UpdateRecipeUsecase(
  AppRecipesRepo,
  AppUsersRepo
);
