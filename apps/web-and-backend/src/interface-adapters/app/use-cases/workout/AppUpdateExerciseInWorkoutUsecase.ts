import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { UpdateExerciseInWorkoutUsecase } from '../../../../application-layer/use-cases/workout/UpdateExerciseInWorkout/UpdateExerciseInWorkout.usecase';

export const AppUpdateExerciseInWorkoutUsecase =
  new UpdateExerciseInWorkoutUsecase(AppWorkoutsRepo, AppUsersRepo);
