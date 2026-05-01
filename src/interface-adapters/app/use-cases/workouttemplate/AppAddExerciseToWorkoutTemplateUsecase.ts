import { AddExerciseToWorkoutTemplateUsecase } from "@/application-layer/use-cases/workouttemplate/AddExerciseToWorkoutTemplate/AddExerciseToWorkoutTemplate.usecase";
import { AppExercisesRepo } from "@/interface-adapters/app/repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "@/interface-adapters/app/repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";
import { AppWorkoutsTemplatesRepo } from "@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo";
import { AppTransactionContext } from "@/interface-adapters/app/services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "@/interface-adapters/app/services/AppUuidV4IdGenerator";

export const AppAddExerciseToWorkoutTemplateUsecase =
  new AddExerciseToWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppExercisesRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator,
    AppExternalExercisesRefRepo,
    AppTransactionContext,
  );
