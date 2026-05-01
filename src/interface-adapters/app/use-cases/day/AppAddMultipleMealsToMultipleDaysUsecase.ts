import { AddMultipleMealsToMultipleDaysUsecase } from '@/application-layer/use-cases/day/AddMultipleMealsToMultipleDays/AddMultipleMealsToMultipleDays.usecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppAddMultipleMealsToMultipleDaysUsecase =
  new AddMultipleMealsToMultipleDaysUsecase(
    AppDaysRepo,
    AppMealsRepo,
    AppUsersRepo,
    AppRecipesRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
