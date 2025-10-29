import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { RemoveIngredientFromRecipeUsecase } from '@/application-layer/use-cases/recipe/RemoveIngredientFromRecipe/RemoveIngredientFromRecipe.usecase';

export const AppRemoveIngredientFromRecipeUsecase =
  new RemoveIngredientFromRecipeUsecase(AppRecipesRepo);
