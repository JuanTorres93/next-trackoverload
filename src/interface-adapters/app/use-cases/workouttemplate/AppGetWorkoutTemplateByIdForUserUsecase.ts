import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { GetWorkoutTemplateByIdForUserUsecase } from '@/application-layer/use-cases/workouttemplate/GetWorkoutTemplateByIdForUser/GetWorkoutTemplateByIdForUser.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppGetWorkoutTemplateByIdForUserUsecase =
  new GetWorkoutTemplateByIdForUserUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
