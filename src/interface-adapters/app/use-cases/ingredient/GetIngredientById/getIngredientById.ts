import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { GetIngredientByIdUsecase } from '@/application-layer/use-cases/ingredient/GetIngredientById/GetIngredientById.usecase';

export const AppGetIngredientByIdUsecase = new GetIngredientByIdUsecase(
  AppIngredientsRepo
);
