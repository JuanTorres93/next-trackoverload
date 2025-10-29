// =============================================================================
// FAKE MEAL USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateFakeMealUsecase } from './CreateFakeMeal/createFakeMeal';

// READ Operations
export { AppGetAllFakeMealsForUserUsecase } from './GetAllFakeMealsForUser/getAllFakeMealsForUser';
export { AppGetFakeMealByIdForUserUsecase } from './GetFakeMealByIdForUser/getFakeMealByIdForUser';
export { AppGetFakeMealsByIdsForUserUsecase } from './GetFakeMealsByIdsForUser/getFakeMealsByIdsForUser';

// UPDATE Operations
export { AppUpdateFakeMealUsecase } from './UpdateFakeMeal/updateFakeMeal';

// DELETE Operations
export { AppDeleteFakeMealUsecase } from './DeleteFakeMeal/deleteFakeMeal';
