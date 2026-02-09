import { CreateRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import { AppExternalIngredientsRefRepo } from '@/interface-adapters/app/repos/AppExternalIngredientsRefRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppImageProcessor } from '@/interface-adapters/app/services/AppImageProcessor';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

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
