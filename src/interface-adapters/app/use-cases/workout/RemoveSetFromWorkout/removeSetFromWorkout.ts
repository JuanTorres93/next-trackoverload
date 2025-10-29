import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { RemoveSetFromWorkoutUsecase } from '@/application-layer/use-cases/workout/RemoveSetFromWorkout/RemoveSetFromWorkout.usecase';

export const AppRemoveSetFromWorkoutUsecase = new RemoveSetFromWorkoutUsecase(
  AppWorkoutsRepo
);
