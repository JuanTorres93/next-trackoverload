import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { UpdateIngredientInMealUsecase } from '@/application-layer/use-cases/meal/UpdateIngredientInMeal/UpdateIngredientInMeal.usecase';

export const AppUpdateIngredientInMealUsecase =
  new UpdateIngredientInMealUsecase(AppMealsRepo, AppIngredientsRepo);
