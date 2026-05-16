import { AddMultipleMealsToMultipleDaysUsecase } from '../../../../application-layer/use-cases/day/AddMultipleMealsToMultipleDays/AddMultipleMealsToMultipleDays.usecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppTransactionContext } from '../../services/AppTransactionContext';

export const AppAddMultipleMealsToMultipleDaysUsecase =
  new AddMultipleMealsToMultipleDaysUsecase(
    AppDaysRepo,
    AppMealsRepo,
    AppUsersRepo,
    AppRecipesRepo,
    AppUuidV4IdGenerator,
    AppTransactionContext,
  );
