import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { DeleteMealUsecase } from '@/application-layer/use-cases/meal/DeleteMeal/DeleteMeal.usecase';

export const AppDeleteMealUsecase = new DeleteMealUsecase(AppMealsRepo);
