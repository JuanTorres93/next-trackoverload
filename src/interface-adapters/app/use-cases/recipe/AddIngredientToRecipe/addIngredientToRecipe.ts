import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AddIngredientToRecipeUsecase } from '@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';
import { AppExternalIngredientsRefRepo } from '@/interface-adapters/app/repos/AppExternalIngredientsRefRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppUnitOfWork } from '@/interface-adapters/app/repos/AppUnitOfWork';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppUsersRepo,
  AppExternalIngredientsRefRepo,
  AppUuidV4IdGenerator,
  AppUnitOfWork,
);
