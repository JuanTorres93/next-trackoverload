// =============================================================================
// DAY USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateDayUsecase } from './CreateDay/createDay';

// READ Operations
export { AppGetAllDaysUsecase } from './GetAllDays/getAllDays';
export { AppGetDayByIdUsecase } from './GetDayById/getDayById';

// UPDATE Operations
export { AppAddMealToDayUsecase } from './AddMealToDay/addMealToDay';
export { AppAddFakeMealToDayUsecase } from './AddFakeMealToDay/addFakeMealToDay';
export { AppRemoveMealFromDayUsecase } from './RemoveMealFromDay/removeMealFromDay';

// DELETE Operations
export { AppDeleteDayUsecase } from './DeleteDay/deleteDay';
