import { CreateRecipeUsecase } from '../../../../application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import { AppExternalIngredientsRefRepo } from '../../repos/AppExternalIngredientsRefRepo';
import { AppImagesRepo } from '../../repos/AppImagesRepo';
import { AppIngredientsRepo } from '../../repos/AppIngredientsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppImageProcessor } from '../../services/AppImageProcessor';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppCreateRecipeUsecase = new CreateRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppImagesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExternalIngredientsRefRepo,
  AppImageProcessor,
  AppTransactionContext,
);
