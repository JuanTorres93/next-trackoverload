import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetWorkoutByIdForUserUsecase } from '@/application-layer/use-cases/workout/GetWorkoutByIdForUser/GetWorkoutByIdForUser.usecase';

export const AppGetWorkoutByIdForUserUsecase = new GetWorkoutByIdForUserUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
