import { AppIngredientsRepo } from '../../repos/AppIngredientsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { UpdateIngredientLineUsecase } from '../../../../application-layer/use-cases/ingredientline/UpdateIngredientLine/UpdateIngredientLine.usecase';

export const AppUpdateIngredientLineUsecase = new UpdateIngredientLineUsecase(
  AppIngredientsRepo,
  AppRecipesRepo,
  AppMealsRepo,
  AppUsersRepo
);
