import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { GetIngredientsByIdsUsecase } from '@/application-layer/use-cases/ingredient/GetIngredientsByIds/GetIngredientsByIds.usecase';

export const AppGetIngredientsByIdsUsecase = new GetIngredientsByIdsUsecase(
  AppIngredientsRepo
);
