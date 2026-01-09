import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';
import { AppImageProcessor } from '@/interface-adapters/app/services/AppImageProcessor';
import { UpdateRecipeImageUsecase } from '@/application-layer/use-cases/recipe/UpdateRecipeImage/UpdateRecipeImageUsecase';

export const AppUpdateRecipeImageUsecase = new UpdateRecipeImageUsecase(
  AppRecipesRepo,
  AppImagesRepo,
  AppImageProcessor
);
