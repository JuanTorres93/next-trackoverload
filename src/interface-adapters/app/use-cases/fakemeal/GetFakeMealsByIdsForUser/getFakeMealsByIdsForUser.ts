import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { GetFakeMealsByIdsForUserUsecase } from '@/application-layer/use-cases/fakemeal/GetFakeMealsByIdsForUser/GetFakeMealsByIdsForUser.usecase';

export const AppGetFakeMealsByIdsForUserUsecase =
  new GetFakeMealsByIdsForUserUsecase(AppFakeMealsRepo);
