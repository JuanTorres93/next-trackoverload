import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateIngredientLineUsecase } from '@/application-layer/use-cases/ingredientline/UpdateIngredientLine/UpdateIngredientLine.usecase';

export const AppUpdateIngredientLineUsecase = new UpdateIngredientLineUsecase(
  AppIngredientsRepo,
  AppRecipesRepo,
  AppMealsRepo,
  AppUsersRepo
);
