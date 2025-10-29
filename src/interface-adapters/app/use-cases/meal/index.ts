// =============================================================================
// MEAL USE CASES - CONFIGURED INSTANCES
// =============================================================================

// READ Operations
export { AppGetAllMealsForUserUsecase } from './GetAllMealsForUser/getAllMealsForUser';
export { AppGetMealByIdForUserUsecase } from './GetMealByIdForUser/getMealByIdForUser';
export { AppGetMealsByIdsForUserUsecase } from './GetMealsByIdsForUser/getMealsByIdsForUser';

// UPDATE Operations
export { AppUpdateMealUsecase } from './UpdateMeal/updateMeal';
export { AppAddIngredientToMealUsecase } from './AddIngredientToMeal/addIngredientToMeal';
export { AppRemoveIngredientFromMealUsecase } from './RemoveIngredientFromMeal/removeIngredientFromMeal';
export { AppUpdateIngredientInMealUsecase } from './UpdateIngredientInMeal/updateIngredientInMeal';

// DELETE Operations
export { AppDeleteMealUsecase } from './DeleteMeal/deleteMeal';
