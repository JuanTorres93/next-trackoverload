import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { RemoveIngredientFromRecipeUsecase } from '@/application-layer/use-cases/recipe/RemoveIngredientFromRecipe/RemoveIngredientFromRecipe.usecase';

export const AppRemoveIngredientFromRecipeUsecase =
  new RemoveIngredientFromRecipeUsecase(AppRecipesRepo, AppUsersRepo);
