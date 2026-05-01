import { DeleteUserUsecase } from '@/application-layer/use-cases/user/DeleteUser/DeleteUser.usecase';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { AppTransactionContext } from '@/interface-adapters/app/services/AppTransactionContext';

export const AppDeleteUserUsecase = new DeleteUserUsecase(
  AppUsersRepo,
  AppDaysRepo,
  AppFakeMealsRepo,
  AppMealsRepo,
  AppRecipesRepo,
  AppWorkoutsRepo,
  AppWorkoutsTemplatesRepo,
  AppTransactionContext,
);
