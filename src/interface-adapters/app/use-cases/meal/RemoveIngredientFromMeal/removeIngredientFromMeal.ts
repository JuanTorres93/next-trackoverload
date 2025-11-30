import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { RemoveIngredientFromMealUsecase } from '@/application-layer/use-cases/meal/RemoveIngredientFromMeal/RemoveIngredientFromMeal.usecase';

export const AppRemoveIngredientFromMealUsecase =
  new RemoveIngredientFromMealUsecase(AppMealsRepo, AppUsersRepo);
