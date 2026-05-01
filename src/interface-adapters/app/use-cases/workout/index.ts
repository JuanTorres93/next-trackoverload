// =============================================================================
// WORKOUT USE CASES - CONFIGURED INSTANCES
// =============================================================================

// READ Operations
export { AppGetAllWorkoutsForUserUsecase } from "./AppGetAllWorkoutsForUserUsecase";
export { AppGetWorkoutByIdForUserUsecase } from "./AppGetWorkoutByIdForUserUsecase";
export { AppGetWorkoutsByTemplateForUserUsecase } from "./AppGetWorkoutsByTemplateForUserUsecase";

// UPDATE Operations
export { AppUpdateWorkoutUsecase } from "./AppUpdateWorkoutUsecase";
export { AppAddExerciseToWorkoutUsecase } from "./AppAddExerciseToWorkoutUsecase";
export { AppRemoveSetFromWorkoutUsecase } from "./AppRemoveSetFromWorkoutUsecase";
export { AppUpdateExerciseInWorkoutUsecase } from "./AppUpdateExerciseInWorkoutUsecase";

// DELETE Operations
export { AppDeleteWorkoutUsecase } from "./AppDeleteWorkoutUsecase";
