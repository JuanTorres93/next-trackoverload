import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AddIngredientToMealUsecase } from '@/application-layer/use-cases/meal/AddIngredientToMeal/AddIngredientToMeal.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppAddIngredientToMealUsecase = new AddIngredientToMealUsecase(
  AppMealsRepo,
  AppIngredientsRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator
);
