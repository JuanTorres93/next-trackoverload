import { AddExerciseToWorkoutTemplateUsecase } from "../../../../application-layer/use-cases/workouttemplate/AddExerciseToWorkoutTemplate/AddExerciseToWorkoutTemplate.usecase";
import { AppExercisesRepo } from "../../repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "../../repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";
import { AppWorkoutsTemplatesRepo } from "../../repos/AppWorkoutsTemplatesRepo";
import { AppTransactionContext } from "../../services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "../../services/AppUuidV4IdGenerator";

export const AppAddExerciseToWorkoutTemplateUsecase =
  new AddExerciseToWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppExercisesRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator,
    AppExternalExercisesRefRepo,
    AppTransactionContext,
  );
