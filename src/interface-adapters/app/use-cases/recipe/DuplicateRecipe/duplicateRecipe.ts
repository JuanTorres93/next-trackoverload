import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';

import { DuplicateRecipeUsecase } from '@/application-layer/use-cases/recipe/DuplicateRecipe/DuplicateRecipe.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppDuplicateRecipeUsecase = new DuplicateRecipeUsecase(
  AppRecipesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppImagesRepo,
);
