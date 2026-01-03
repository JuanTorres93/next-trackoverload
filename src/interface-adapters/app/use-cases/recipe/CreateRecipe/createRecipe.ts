import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppImageManager } from '@/interface-adapters/app/services/AppImageManager';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppExternalIngredientsRefRepo } from '@/interface-adapters/app/repos/AppExternalIngredientsRefRepo';
import { CreateRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppCreateRecipeUsecase = new CreateRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppImageManager,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExternalIngredientsRefRepo
);
