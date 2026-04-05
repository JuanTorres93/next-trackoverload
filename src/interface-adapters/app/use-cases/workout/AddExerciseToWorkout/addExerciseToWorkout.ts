import { AddExerciseToWorkoutUsecase } from "@/application-layer/use-cases/workout/AddExerciseToWorkout/AddExerciseToWorkout.usecase";
import { AppExercisesRepo } from "@/interface-adapters/app/repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "@/interface-adapters/app/repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";
import { AppWorkoutsRepo } from "@/interface-adapters/app/repos/AppWorkoutsRepo";
import { AppTransactionContext } from "@/interface-adapters/app/services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "@/interface-adapters/app/services/AppUuidV4IdGenerator";

export const AppAddExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
  AppWorkoutsRepo,
  AppExercisesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExternalExercisesRefRepo,
  AppTransactionContext,
);
