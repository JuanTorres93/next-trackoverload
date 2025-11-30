import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AddIngredientToMealUsecase } from '@/application-layer/use-cases/meal/AddIngredientToMeal/AddIngredientToMeal.usecase';

export const AppAddIngredientToMealUsecase = new AddIngredientToMealUsecase(
  AppMealsRepo,
  AppIngredientsRepo,
  AppUsersRepo
);
