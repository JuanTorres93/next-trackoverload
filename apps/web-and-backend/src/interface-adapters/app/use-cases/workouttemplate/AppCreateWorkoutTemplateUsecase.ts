import { CreateWorkoutTemplateUsecase } from "../../../../application-layer/use-cases/workouttemplate/CreateWorkoutTemplate/CreateWorkoutTemplate.usecase";
import { AppExercisesRepo } from "../../repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "../../repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";
import { AppWorkoutsTemplatesRepo } from "../../repos/AppWorkoutsTemplatesRepo";
import { AppTransactionContext } from "../../services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "../../services/AppUuidV4IdGenerator";

export const AppCreateWorkoutTemplateUsecase = new CreateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExercisesRepo,
  AppExternalExercisesRefRepo,
  AppTransactionContext,
);
