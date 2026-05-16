import { ToggleIsEatenUsecase } from '../../../../application-layer/use-cases/meal/ToggleIsEaten/ToggleIsEatenUsecase';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppToggleIsEatenUsecase = new ToggleIsEatenUsecase(
  AppMealsRepo,
  AppUsersRepo,
);
