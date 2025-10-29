import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { UpdateExerciseInWorkoutUsecase } from '@/application-layer/use-cases/workout/UpdateExerciseInWorkout/UpdateExerciseInWorkout.usecase';

export const AppUpdateExerciseInWorkoutUsecase =
  new UpdateExerciseInWorkoutUsecase(AppWorkoutsRepo);
