import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { DeleteWorkoutUsecase } from '@/application-layer/use-cases/workout/DeleteWorkout/DeleteWorkout.usecase';

export const AppDeleteWorkoutUsecase = new DeleteWorkoutUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
