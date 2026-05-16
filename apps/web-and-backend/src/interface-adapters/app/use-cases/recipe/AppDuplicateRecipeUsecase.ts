import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppImagesRepo } from '../../repos/AppImagesRepo';

import { DuplicateRecipeUsecase } from '../../../../application-layer/use-cases/recipe/DuplicateRecipe/DuplicateRecipe.usecase';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';

export const AppDuplicateRecipeUsecase = new DuplicateRecipeUsecase(
  AppRecipesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppImagesRepo,
);
