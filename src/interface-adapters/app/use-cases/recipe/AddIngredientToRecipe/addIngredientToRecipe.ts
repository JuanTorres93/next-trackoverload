import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AddIngredientToRecipeUsecase } from '@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppUsersRepo
);
