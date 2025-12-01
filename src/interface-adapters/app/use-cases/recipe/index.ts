// =============================================================================
// RECIPE USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateRecipeUsecase } from './CreateRecipe/createRecipe';
export { AppDuplicateRecipeUsecase } from './DuplicateRecipe/duplicateRecipe';

// READ Operations
export { AppGetAllRecipesForUserUsecase } from './GetAllRecipesForUser/getAllRecipesForUser';
export { AppGetRecipeByIdForUserUsecase } from './GetRecipeByIdForUser/getRecipeByIdForUser';
export { AppGetRecipesByIdsForUserUsecase } from './GetRecipesByIdsForUser/getRecipesByIdsForUser';

// UPDATE Operations
export { AppUpdateRecipeUsecase } from './UpdateRecipe/updateRecipe';
export { AppAddIngredientToRecipeUsecase } from './AddIngredientToRecipe/addIngredientToRecipe';
export { AppRemoveIngredientFromRecipeUsecase } from './RemoveIngredientFromRecipe/removeIngredientFromRecipe';

// DELETE Operations
export { AppDeleteRecipeUsecase } from './DeleteRecipe/deleteRecipe';
