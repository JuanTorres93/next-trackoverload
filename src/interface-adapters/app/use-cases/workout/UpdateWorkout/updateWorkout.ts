import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateWorkoutUsecase } from '@/application-layer/use-cases/workout/UpdateWorkout/UpdateWorkout.usecase';

export const AppUpdateWorkoutUsecase = new UpdateWorkoutUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
