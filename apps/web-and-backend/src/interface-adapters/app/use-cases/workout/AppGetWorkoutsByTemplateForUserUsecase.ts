import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { GetWorkoutsByTemplateForUserUsecase } from '../../../../application-layer/use-cases/workout/GetWorkoutsByTemplateForUser/GetWorkoutsByTemplateForUser.usecase';

export const AppGetWorkoutsByTemplateForUserUsecase =
  new GetWorkoutsByTemplateForUserUsecase(AppWorkoutsRepo, AppUsersRepo);
