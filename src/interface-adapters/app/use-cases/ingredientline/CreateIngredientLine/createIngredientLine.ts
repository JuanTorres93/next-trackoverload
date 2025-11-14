import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { CreateIngredientLineUsecase } from '@/application-layer/use-cases/ingredientline/CreateIngredientLine/CreateIngredientLine.usecase';

export const AppCreateIngredientLineUsecase = new CreateIngredientLineUsecase(
  AppIngredientLinesRepo,
  AppIngredientsRepo
);
