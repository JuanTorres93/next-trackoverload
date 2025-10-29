import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AddIngredientToMealUsecase } from '@/application-layer/use-cases/meal/AddIngredientToMeal/AddIngredientToMeal.usecase';

export const AppAddIngredientToMealUsecase = new AddIngredientToMealUsecase(
  AppMealsRepo
);
