import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { GetAllFakeMealsForUserUsecase } from '@/application-layer/use-cases/fakemeal/GetAllFakeMealsForUser/GetAllFakeMealsForUser.usecase';

export const AppGetAllFakeMealsForUserUsecase =
  new GetAllFakeMealsForUserUsecase(AppFakeMealsRepo);
