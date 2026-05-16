import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { GetAllWorkoutTemplatesForUserUsecase } from '../../../../application-layer/use-cases/workouttemplate/GetAllWorkoutTemplatesForUser/GetAllWorkoutTemplatesForUser.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppGetAllWorkoutTemplatesForUserUsecase =
  new GetAllWorkoutTemplatesForUserUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
