import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { GetAllWorkoutsForUserUsecase } from '../../../../application-layer/use-cases/workout/GetAllWorkoutsForUser/GetAllWorkoutsForUser.usecase';

export const AppGetAllWorkoutsForUserUsecase = new GetAllWorkoutsForUserUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
