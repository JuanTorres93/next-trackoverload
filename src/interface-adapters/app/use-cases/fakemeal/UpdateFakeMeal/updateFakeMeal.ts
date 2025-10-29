import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { UpdateFakeMealUsecase } from '@/application-layer/use-cases/fakemeal/UpdateFakeMeal/UpdateFakeMeal.usecase';

export const AppUpdateFakeMealUsecase = new UpdateFakeMealUsecase(
  AppFakeMealsRepo
);
