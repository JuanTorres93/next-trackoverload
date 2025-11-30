import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AddIngredientToMealUsecase } from '@/application-layer/use-cases/meal/AddIngredientToMeal/AddIngredientToMeal.usecase';

export const AppAddIngredientToMealUsecase = new AddIngredientToMealUsecase(
  AppMealsRepo,
  AppIngredientsRepo
);
