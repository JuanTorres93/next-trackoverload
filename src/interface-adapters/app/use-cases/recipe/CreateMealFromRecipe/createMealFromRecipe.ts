import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { CreateMealFromRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateMealFromRecipe/CreateMealFromRecipe.usecase';

export const AppCreateMealFromRecipeUsecase = new CreateMealFromRecipeUsecase(
  AppRecipesRepo,
  AppMealsRepo
);
