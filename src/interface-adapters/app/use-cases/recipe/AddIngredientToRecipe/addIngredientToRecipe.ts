import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AddIngredientToRecipeUsecase } from '@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo
);
