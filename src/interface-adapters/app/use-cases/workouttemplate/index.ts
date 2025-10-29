// =============================================================================
// WORKOUT TEMPLATE USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateWorkoutTemplateUsecase } from './CreateWorkoutTemplate/createWorkoutTemplate';
export { AppCreateWorkoutFromTemplateUsecase } from './CreateWorkoutFromTemplate/createWorkoutFromTemplate';
export { AppDuplicateWorkoutTemplateUsecase } from './DuplicateWorkoutTemplate/duplicateWorkoutTemplate';

// READ Operations
export { AppGetAllWorkoutTemplatesForUserUsecase } from './GetAllWorkoutTemplatesForUser/getAllWorkoutTemplatesForUser';
export { AppGetWorkoutTemplateByIdForUserUsecase } from './GetWorkoutTemplateByIdForUser/getWorkoutTemplateByIdForUser';

// UPDATE Operations
export { AppUpdateWorkoutTemplateUsecase } from './UpdateWorkoutTemplate/updateWorkoutTemplate';
export { AppAddExerciseToWorkoutTemplateUsecase } from './AddExerciseToWorkoutTemplate/addExerciseToWorkoutTemplate';
export { AppRemoveExerciseFromWorkoutTemplateUsecase } from './RemoveExerciseFromWorkoutTemplate/removeExerciseFromWorkoutTemplate';
export { AppReorderExerciseInWorkoutTemplateUsecase } from './ReorderExerciseInWorkoutTemplate/reorderExerciseInWorkoutTemplate';
export { AppUpdateExerciseInWorkoutTemplateUsecase } from './UpdateExerciseInWorkoutTemplate/updateExerciseInWorkoutTemplate';

// DELETE Operations
export { AppDeleteWorkoutTemplateUsecase } from './DeleteWorkoutTemplate/deleteWorkoutTemplate';
