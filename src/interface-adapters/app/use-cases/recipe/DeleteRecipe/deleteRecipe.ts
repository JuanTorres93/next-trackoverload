import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';
import { AppImageManager } from '@/interface-adapters/app/services/AppImageManager';
import { DeleteRecipeUsecase } from '@/application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(
  AppRecipesRepo,
  AppIngredientLinesRepo,
  AppImageManager
);
