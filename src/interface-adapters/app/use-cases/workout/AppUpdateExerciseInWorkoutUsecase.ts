import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateExerciseInWorkoutUsecase } from '@/application-layer/use-cases/workout/UpdateExerciseInWorkout/UpdateExerciseInWorkout.usecase';

export const AppUpdateExerciseInWorkoutUsecase =
  new UpdateExerciseInWorkoutUsecase(AppWorkoutsRepo, AppUsersRepo);
