import { AddIngredientToRecipeUsecase } from '../../../../application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase';
import { AppExternalIngredientsRefRepo } from '../../repos/AppExternalIngredientsRefRepo';
import { AppIngredientsRepo } from '../../repos/AppIngredientsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppAddIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppUsersRepo,
  AppExternalIngredientsRefRepo,
  AppUuidV4IdGenerator,
  AppTransactionContext,
);
