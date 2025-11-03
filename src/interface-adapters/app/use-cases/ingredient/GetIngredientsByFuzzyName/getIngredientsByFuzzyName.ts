import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { GetIngredientsByFuzzyNameUsecase } from '@/application-layer/use-cases/ingredient/GetIngredientsByFuzzyName/GetIngredientsByFuzzyName.usecase';

export const AppGetIngredientsByFuzzyNameUsecase =
  new GetIngredientsByFuzzyNameUsecase(AppIngredientsRepo);
