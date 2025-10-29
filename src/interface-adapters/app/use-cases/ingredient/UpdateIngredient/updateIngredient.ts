import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { UpdateIngredientUsecase } from '@/application-layer/use-cases/ingredient/UpdateIngredient/UpdateIngredient.usecase';

export const AppUpdateIngredientUsecase = new UpdateIngredientUsecase(
  AppIngredientsRepo
);
