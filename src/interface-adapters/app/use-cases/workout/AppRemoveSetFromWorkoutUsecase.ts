import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { RemoveSetFromWorkoutUsecase } from '@/application-layer/use-cases/workout/RemoveSetFromWorkout/RemoveSetFromWorkout.usecase';

export const AppRemoveSetFromWorkoutUsecase = new RemoveSetFromWorkoutUsecase(
  AppWorkoutsRepo,
  AppUsersRepo
);
