import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { GetAllIngredientsUsecase } from '@/application-layer/use-cases/ingredient/GetAllIngredients/GetAllIngredients.usecase';

export const AppGetAllIngredientsUsecase = new GetAllIngredientsUsecase(
  AppIngredientsRepo
);
