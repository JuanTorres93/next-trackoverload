import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { CreateFakeMealUsecase } from '@/application-layer/use-cases/fakemeal/CreateFakeMeal/CreateFakeMeal.usecase';

export const AppCreateFakeMealUsecase = new CreateFakeMealUsecase(
  AppFakeMealsRepo,
  AppUsersRepo
);
