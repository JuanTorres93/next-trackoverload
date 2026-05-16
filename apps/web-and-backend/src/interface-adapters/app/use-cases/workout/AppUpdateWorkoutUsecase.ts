import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { UpdateWorkoutUsecase } from '../../../../application-layer/use-cases/workout/UpdateWorkout/UpdateWorkout.usecase';

export const AppUpdateWorkoutUsecase = new UpdateWorkoutUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
