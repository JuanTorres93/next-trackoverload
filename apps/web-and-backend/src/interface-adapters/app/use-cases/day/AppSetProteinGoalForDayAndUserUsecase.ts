import { SetProteinGoalForDayAndUserUsecase } from "../../../../application-layer/use-cases/day/SetProteinGoalForDayAndUser/SetProteinGoalForDayAndUserUsecase";
import { AppDaysRepo } from "../../repos/AppDaysRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";

export const AppSetProteinGoalForDayAndUserUsecase =
  new SetProteinGoalForDayAndUserUsecase(AppDaysRepo, AppUsersRepo);
