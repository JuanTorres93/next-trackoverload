import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppImagesRepo } from '../../repos/AppImagesRepo';
import { AppImageProcessor } from '../../services/AppImageProcessor';
import { UpdateRecipeImageUsecase } from '../../../../application-layer/use-cases/recipe/UpdateRecipeImage/UpdateRecipeImageUsecase';

export const AppUpdateRecipeImageUsecase = new UpdateRecipeImageUsecase(
  AppRecipesRepo,
  AppImagesRepo,
  AppImageProcessor
);
