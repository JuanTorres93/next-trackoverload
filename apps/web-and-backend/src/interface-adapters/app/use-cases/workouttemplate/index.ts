// =============================================================================
// WORKOUT TEMPLATE USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateWorkoutTemplateUsecase } from "./AppCreateWorkoutTemplateUsecase";
export { AppCreateWorkoutFromTemplateUsecase } from "./AppCreateWorkoutFromTemplateUsecase";
export { AppDuplicateWorkoutTemplateUsecase } from "./AppDuplicateWorkoutTemplateUsecase";

// READ Operations
export { AppGetAllWorkoutTemplatesForUserUsecase } from "./AppGetAllWorkoutTemplatesForUserUsecase";
export { AppGetWorkoutTemplateByIdForUserUsecase } from "./AppGetWorkoutTemplateByIdForUserUsecase";

// UPDATE Operations
export { AppUpdateWorkoutTemplateUsecase } from "./AppUpdateWorkoutTemplateUsecase";
export { AppAddExerciseToWorkoutTemplateUsecase } from "./AppAddExerciseToWorkoutTemplateUsecase";
export { AppRemoveExerciseFromWorkoutTemplateUsecase } from "./AppRemoveExerciseFromWorkoutTemplateUsecase";
export { AppReorderExerciseInWorkoutTemplateUsecase } from "./AppReorderExerciseInWorkoutTemplateUsecase";
export { AppUpdateExerciseInWorkoutTemplateUsecase } from "./AppUpdateExerciseInWorkoutTemplateUsecase";

// DELETE Operations
export { AppDeleteWorkoutTemplateUsecase } from "./AppDeleteWorkoutTemplateUsecase";
