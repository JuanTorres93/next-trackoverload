import { AddIngredientToRecipeUsecase } from '@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';
import { AppExternalIngredientsRefRepo } from '@/interface-adapters/app/repos/AppExternalIngredientsRefRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppUsersRepo,
  AppExternalIngredientsRefRepo,
  AppUuidV4IdGenerator,
);
