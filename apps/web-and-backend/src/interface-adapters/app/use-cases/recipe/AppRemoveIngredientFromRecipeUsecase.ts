import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { RemoveIngredientFromRecipeUsecase } from '../../../../application-layer/use-cases/recipe/RemoveIngredientFromRecipe/RemoveIngredientFromRecipe.usecase';

export const AppRemoveIngredientFromRecipeUsecase =
  new RemoveIngredientFromRecipeUsecase(AppRecipesRepo, AppUsersRepo);
