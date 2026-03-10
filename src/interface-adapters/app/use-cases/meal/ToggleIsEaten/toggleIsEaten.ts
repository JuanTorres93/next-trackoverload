import { ToggleIsEatenUsecase } from '@/application-layer/use-cases/meal/ToggleIsEaten/ToggleIsEatenUsecase';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppToggleIsEatenUsecase = new ToggleIsEatenUsecase(
  AppMealsRepo,
  AppUsersRepo,
);
