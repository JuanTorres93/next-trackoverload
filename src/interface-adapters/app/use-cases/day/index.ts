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

// UPDATE Operations
export { AppAddMultipleMealsToDayUsecase } from "./AppAddMultipleMealsToDayUsecase";
export { AppAddMultipleMealsToMultipleDaysUsecase } from "./AppAddMultipleMealsToMultipleDaysUsecase";
export { AppAddFakeMealToDayUsecase } from "./AppAddFakeMealToDayUsecase";
export { AppRemoveMealFromDayUsecase } from "./AppRemoveMealFromDayUsecase";
export { AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from "./AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase";
export { AppReplaceFakeMealByMealForUserInDayUsecase } from "./AppReplaceFakeMealByMealForUserInDayUsecase";
export { AppReplaceMealByAnotherMealForUserInDayUsecase } from "./AppReplaceMealByAnotherMealForUserInDayUsecase";
export { AppReplaceMealByFakeMealForUserInDayUsecase } from "./AppReplaceMealByFakeMealForUserInDayUsecase";
export { AppUpdateUserWeightForDayUsecase } from "./AppUpdateUserWeightForDayUsecase";
export { AppSetCaloriesGoalForDayAndUserUsecase } from "./AppSetCaloriesGoalForDayAndUserUsecase";
