import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';
import { AddIngredientToRecipeUsecase } from '@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo,
  AppIngredientLinesRepo
);
