// =============================================================================
// WORKOUT USE CASES - CONFIGURED INSTANCES
// =============================================================================

// READ Operations
export { AppGetAllWorkoutsForUserUsecase } from './GetAllWorkoutsForUser/getAllWorkoutsForUser';
export { AppGetWorkoutByIdForUserUsecase } from './GetWorkoutByIdForUser/getWorkoutByIdForUser';
export { AppGetWorkoutsByTemplateForUserUsecase } from './GetWorkoutsByTemplateForUser/getWorkoutsByTemplateForUser';

// UPDATE Operations
export { AppUpdateWorkoutUsecase } from './UpdateWorkout/updateWorkout';
export { AppAddExerciseToWorkoutUsecase } from './AddExerciseToWorkout/addExerciseToWorkout';
export { AppRemoveSetFromWorkoutUsecase } from './RemoveSetFromWorkout/removeSetFromWorkout';
export { AppUpdateExerciseInWorkoutUsecase } from './UpdateExerciseInWorkout/updateExerciseInWorkout';

// DELETE Operations
export { AppDeleteWorkoutUsecase } from './DeleteWorkout/deleteWorkout';
