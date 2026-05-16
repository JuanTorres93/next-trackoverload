import { AppIngredientsRepo } from '../../repos/AppIngredientsRepo';
import { CreateIngredientUsecase } from '../../../../application-layer/use-cases/ingredient/CreateIngredient/CreateIngredient.usecase';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';

export const AppCreateIngredientUsecase = new CreateIngredientUsecase(
  AppIngredientsRepo,
  AppUuidV4IdGenerator
);
