// =============================================================================
// DAY USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateDayUsecase } from "./AppCreateDayUsecase";

// READ Operations
export { AppGetAssembledDayById } from "./AppGetAssembledDayByIdUsecase";
export { AppGetMultipleAssembledDaysByIds } from "./AppGetMultipleAssembledDaysByIdsUsecase";
export { AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays } from "./AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
export { AppGetLastDayWithCaloriesGoalForUserUsecase } from "./AppGetLastDayWithCaloriesGoalForUserUsecase";
export { AppGetWeightFeedbackForLastNDaysUsecase } from "./AppGetWeightFeedbackForLastNDaysUsecase";

// UPDATE Operations
export { AppAddMultipleMealsToDayUsecase } from "./AppAddMultipleMealsToDayUsecase";
export { AppAddMultipleMealsToMultipleDaysUsecase } from "./AppAddMultipleMealsToMultipleDaysUsecase";
export { AppAddFakeMealToDayUsecase } from "./AppAddFakeMealToDayUsecase";
export { AppRemoveFakeMealFromDayUsecase } from "./AppRemoveFakeMealFromDayUsecase";
export { AppRemoveMealFromDayUsecase } from "./AppRemoveMealFromDayUsecase";
export { AppUpdateUserWeightForDayUsecase } from "./AppUpdateUserWeightForDayUsecase";
export { AppSetCaloriesGoalForDayAndUserUsecase } from "./AppSetCaloriesGoalForDayAndUserUsecase";
