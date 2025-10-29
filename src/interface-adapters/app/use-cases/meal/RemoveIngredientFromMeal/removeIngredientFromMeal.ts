import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { RemoveIngredientFromMealUsecase } from '@/application-layer/use-cases/meal/RemoveIngredientFromMeal/RemoveIngredientFromMeal.usecase';

export const AppRemoveIngredientFromMealUsecase =
  new RemoveIngredientFromMealUsecase(AppMealsRepo);
