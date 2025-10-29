import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { AddExerciseToWorkoutUsecase } from '@/application-layer/use-cases/workout/AddExerciseToWorkout/AddExerciseToWorkout.usecase';

export const AppAddExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
  AppWorkoutsRepo,
  AppExercisesRepo
);
