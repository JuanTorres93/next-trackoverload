import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateFakeMealUsecase } from '@/application-layer/use-cases/fakemeal/UpdateFakeMeal/UpdateFakeMeal.usecase';

export const AppUpdateFakeMealUsecase = new UpdateFakeMealUsecase(
  AppFakeMealsRepo,
  AppUsersRepo
);
