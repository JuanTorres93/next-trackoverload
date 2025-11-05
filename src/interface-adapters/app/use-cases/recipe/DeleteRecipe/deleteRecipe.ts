import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { DeleteRecipeUsecase } from '@/application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';
import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(
  AppRecipesRepo,
  AppIngredientLinesRepo
);
