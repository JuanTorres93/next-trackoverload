import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetFakeMealsByIdsForUserUsecase } from '@/application-layer/use-cases/fakemeal/GetFakeMealsByIdsForUser/GetFakeMealsByIdsForUser.usecase';

export const AppGetFakeMealsByIdsForUserUsecase =
  new GetFakeMealsByIdsForUserUsecase(AppFakeMealsRepo, AppUsersRepo);
