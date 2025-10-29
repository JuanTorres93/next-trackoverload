import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { DuplicateRecipeUsecase } from '@/application-layer/use-cases/recipe/DuplicateRecipe/DuplicateRecipe.usecase';

export const AppDuplicateRecipeUsecase = new DuplicateRecipeUsecase(
  AppRecipesRepo
);
