import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppImagesRepo } from '@/interface-adapters/app/repos/AppImagesRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { CreateMealFromRecipeUsecase } from '@/application-layer/use-cases/recipe/CreateMealFromRecipe/CreateMealFromRecipeUsecase';

export const AppCreateMealFromRecipeUsecase = new CreateMealFromRecipeUsecase(
  AppUsersRepo,
  AppRecipesRepo,
  AppMealsRepo,
  AppImagesRepo,
  AppUuidV4IdGenerator
);
