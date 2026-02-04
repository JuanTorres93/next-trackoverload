import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';
import { AppImageProcessor } from '@/interface-adapters/app/services/AppImageProcessor';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppExternalIngredientsRefRepo } from '@/interface-adapters/app/repos/AppExternalIngredientsRefRepo';
import { CreateRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppUnitOfWork } from '@/interface-adapters/app/repos/AppUnitOfWork';

export const AppCreateRecipeUsecase = new CreateRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo,
  AppImagesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExternalIngredientsRefRepo,
  AppImageProcessor,
  AppUnitOfWork,
);
