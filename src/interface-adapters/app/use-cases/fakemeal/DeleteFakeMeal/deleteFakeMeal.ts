import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { DeleteFakeMealUsecase } from '@/application-layer/use-cases/fakemeal/DeleteFakeMeal/DeleteFakeMeal.usecase';

export const AppDeleteFakeMealUsecase = new DeleteFakeMealUsecase(
  AppFakeMealsRepo
);
