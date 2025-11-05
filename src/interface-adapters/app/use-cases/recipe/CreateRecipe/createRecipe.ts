import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { CreateRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';

export const AppCreateRecipeUsecase = new CreateRecipeUsecase(
  AppRecipesRepo,
  AppIngredientsRepo
);
