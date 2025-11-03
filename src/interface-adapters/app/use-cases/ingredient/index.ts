// =============================================================================
// INGREDIENT USE CASES - CONFIGURED INSTANCES
// =============================================================================

// CREATE Operations
export { AppCreateIngredientUsecase } from './CreateIngredient/createingredient';

// READ Operations
export { AppGetAllIngredientsUsecase } from './GetAllIngredients/getAllIngredients';
export { AppGetIngredientByIdUsecase } from './GetIngredientById/getIngredientById';
export { AppGetIngredientsByIdsUsecase } from './GetIngredientsByIds/getIngredientsByIds';
export { AppGetIngredientsByFuzzyNameUsecase } from './GetIngredientsByFuzzyName/getIngredientsByFuzzyName';

// UPDATE Operations
export { AppUpdateIngredientUsecase } from './UpdateIngredient/updateIngredient';

// DELETE Operations
export { AppDeleteIngredientUsecase } from './DeleteIngredient/deleteIngredient';
