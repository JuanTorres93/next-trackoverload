import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { CreateIngredientUsecase } from '@/application-layer/use-cases/ingredient/CreateIngredient/CreateIngredient.usecase';

export const AppCreateIngredientUsecase = new CreateIngredientUsecase(
  AppIngredientsRepo
);
