import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { GetWorkoutByIdForUserUsecase } from '../../../../application-layer/use-cases/workout/GetWorkoutByIdForUser/GetWorkoutByIdForUser.usecase';

export const AppGetWorkoutByIdForUserUsecase = new GetWorkoutByIdForUserUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
