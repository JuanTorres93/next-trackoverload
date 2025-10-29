import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { DeleteIngredientUsecase } from '@/application-layer/use-cases/ingredient/DeleteIngredient/DeleteIngredient.usecase';

export const AppDeleteIngredientUsecase = new DeleteIngredientUsecase(
  AppIngredientsRepo
);
