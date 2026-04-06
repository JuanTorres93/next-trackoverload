// =============================================================================
// DAY USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateDayUsecase } from "./CreateDay/createDay";

// READ Operations
export { AppGetAssembledDayById } from "./GetAssembledDayById/getAssembledDayById";
export { AppGetMultipleAssembledDaysByIds } from "./GetMultipleAssembledDaysByIds/getMultipleAssembledDaysByIds";
export { AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays } from "./GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/getLastNumberOfDaysForUserIncludingTodayAndNonExistentDays";
export { AppGetLastDayWithCaloriesGoalForUserUsecase } from "./GetLastDayWithCaloriesGoalForUser/getLastDayWithCaloriesGoalForUser";

// UPDATE Operations
export { AppAddMultipleMealsToDayUsecase } from "./AddMultipleMealsToDay/addMultipleMealsToDay";
export { AppAddMultipleMealsToMultipleDaysUsecase } from "./AddMultipleMealsToMultipleDays/addMultipleMealsToMultipleDays";
export { AppAddFakeMealToDayUsecase } from "./AddFakeMealToDay/addFakeMealToDay";
export { AppRemoveMealFromDayUsecase } from "./RemoveMealFromDay/removeMealFromDay";
export { AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from "./ReplaceFakeMealByAnotherFakeMealForUserInDay/replaceFakeMealByAnotherFakeMealForUserInDay";
export { AppReplaceFakeMealByMealForUserInDayUsecase } from "./ReplaceFakeMealByMealForUserInDay/replaceFakeMealByMealForUserInDay";
export { AppReplaceMealByAnotherMealForUserInDayUsecase } from "./ReplaceMealByAnotherMealForUserInDay/replaceMealByAnotherMealForUserInDay";
export { AppReplaceMealByFakeMealForUserInDayUsecase } from "./ReplaceMealByFakeMealForUserInDay/replaceMealByFakeMealForUserInDay";
export { AppUpdateUserWeightForDayUsecase } from "./UpdateUserWeightForDay/updateUserWeightForDay";
export { AppSetCaloriesGoalForDayAndUserUsecase } from "./SetCaloriesGoalForDayAndUser/setCaloriesGoalForDayAndUser";
