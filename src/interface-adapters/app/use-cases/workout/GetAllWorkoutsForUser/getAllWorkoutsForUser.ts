import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { GetAllWorkoutsForUserUsecase } from '@/application-layer/use-cases/workout/GetAllWorkoutsForUser/GetAllWorkoutsForUser.usecase';

export const AppGetAllWorkoutsForUserUsecase = new GetAllWorkoutsForUserUsecase(
  AppWorkoutsRepo
);
