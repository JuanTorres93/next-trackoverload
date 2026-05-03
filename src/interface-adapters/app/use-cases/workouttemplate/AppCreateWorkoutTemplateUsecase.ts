import { CreateWorkoutTemplateUsecase } from "@/application-layer/use-cases/workouttemplate/CreateWorkoutTemplate/CreateWorkoutTemplate.usecase";
import { AppExercisesRepo } from "@/interface-adapters/app/repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "@/interface-adapters/app/repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";
import { AppWorkoutsTemplatesRepo } from "@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo";
import { AppTransactionContext } from "@/interface-adapters/app/services/AppTransactionContext";
import { AppUuidV4IdGenerator } from "@/interface-adapters/app/services/AppUuidV4IdGenerator";

export const AppCreateWorkoutTemplateUsecase = new CreateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppExercisesRepo,
  AppExternalExercisesRefRepo,
  AppTransactionContext,
);
