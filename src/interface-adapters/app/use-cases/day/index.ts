// =============================================================================
// DAY USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateDayUsecase } from './CreateDay/createDay';

// READ Operations
export { AppGetDayByIdUsecase } from './GetDayById/getDayById';
export { AppGetAssembledDayById } from './GetAssembledDayById/getAssembledDayById';
export { AppGetMultipleAssembledDaysByIds } from './GetMultipleAssembledDaysByIds/getMultipleAssembledDaysByIds';

// UPDATE Operations
export { AppAddMultipleMealsToDayUsecase } from './AddMultipleMealsToDay/addMultipleMealsToDay';
export { AppAddMultipleMealsToMultipleDaysUsecase } from './AddMultipleMealsToMultipleDays/addMultipleMealsToMultipleDays';
export { AppAddFakeMealToDayUsecase } from './AddFakeMealToDay/addFakeMealToDay';
export { AppRemoveMealFromDayUsecase } from './RemoveMealFromDay/removeMealFromDay';
export { AppUpdateUserWeightForDayUsecase } from './UpdateUserWeightForDay/updateUserWeightForDay';

// DELETE Operations
export { AppDeleteDayUsecase } from './DeleteDay/deleteDay';
