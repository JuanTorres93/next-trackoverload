import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { UpdateIngredientLineUsecase } from '@/application-layer/use-cases/ingredientline/UpdateIngredientLine/UpdateIngredientLine.usecase';

export const AppUpdateIngredientLineUsecase = new UpdateIngredientLineUsecase(
  AppIngredientLinesRepo,
  AppIngredientsRepo
);
