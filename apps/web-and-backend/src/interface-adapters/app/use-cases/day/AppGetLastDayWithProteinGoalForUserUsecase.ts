import { GetLastDayWithProteinGoalForUserUsecase } from "../../../../application-layer/use-cases/day/GetLastDayWithProteinGoalForUser/GetLastDayWithProteinGoalForUser.usecase";
import { AppDaysRepo } from "../../repos/AppDaysRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";

export const AppGetLastDayWithProteinGoalForUserUsecase =
  new GetLastDayWithProteinGoalForUserUsecase(AppDaysRepo, AppUsersRepo);
