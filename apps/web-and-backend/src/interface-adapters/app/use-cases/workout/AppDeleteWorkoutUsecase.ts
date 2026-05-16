import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { DeleteWorkoutUsecase } from '../../../../application-layer/use-cases/workout/DeleteWorkout/DeleteWorkout.usecase';

export const AppDeleteWorkoutUsecase = new DeleteWorkoutUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
