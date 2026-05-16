import { AddExerciseToWorkoutUsecase } from "../../../../application-layer/use-cases/workout/AddExerciseToWorkout/AddExerciseToWorkout.usecase";
import { AppExercisesRepo } from "../../repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "../../repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";
import { AppWorkoutsRepo } from "../../repos/AppWorkoutsRepo";
import { AppTransactionContext } from "../../services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "../../services/AppUuidV4IdGenerator";

export const AppAddExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
  AppWorkoutsRepo,
  AppExercisesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExternalExercisesRefRepo,
  AppTransactionContext,
);
