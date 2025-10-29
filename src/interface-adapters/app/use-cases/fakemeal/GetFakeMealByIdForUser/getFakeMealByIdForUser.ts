import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { GetFakeMealByIdForUserUsecase } from '@/application-layer/use-cases/fakemeal/GetFakeMealByIdForUser/GetFakeMealByIdForUser.usecase';

export const AppGetFakeMealByIdForUserUsecase =
  new GetFakeMealByIdForUserUsecase(AppFakeMealsRepo);
