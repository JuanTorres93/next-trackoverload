import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { UpdateDayMealsUsecase } from '@/application-layer/use-cases/day/UpdateDayMeals/UpdateDayMeals.usecase';

export const AppUpdateDayMealsUsecase = new UpdateDayMealsUsecase(AppDaysRepo);
