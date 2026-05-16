import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { GetWorkoutTemplateByIdForUserUsecase } from '../../../../application-layer/use-cases/workouttemplate/GetWorkoutTemplateByIdForUser/GetWorkoutTemplateByIdForUser.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppGetWorkoutTemplateByIdForUserUsecase =
  new GetWorkoutTemplateByIdForUserUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
