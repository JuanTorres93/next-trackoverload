import { DeleteUserUsecase } from '../../../../application-layer/use-cases/user/DeleteUser/DeleteUser.usecase';
import { AppDaysRepo } from '../../repos/AppDaysRepo';
import { AppFakeMealsRepo } from '../../repos/AppFakeMealsRepo';
import { AppMealsRepo } from '../../repos/AppMealsRepo';
import { AppRecipesRepo } from '../../repos/AppRecipesRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { AppTransactionContext } from '../../services/AppTransactionContext';

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
