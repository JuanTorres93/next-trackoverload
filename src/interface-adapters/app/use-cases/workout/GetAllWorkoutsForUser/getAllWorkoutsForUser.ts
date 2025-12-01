import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetAllWorkoutsForUserUsecase } from '@/application-layer/use-cases/workout/GetAllWorkoutsForUser/GetAllWorkoutsForUser.usecase';

export const AppGetAllWorkoutsForUserUsecase = new GetAllWorkoutsForUserUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
