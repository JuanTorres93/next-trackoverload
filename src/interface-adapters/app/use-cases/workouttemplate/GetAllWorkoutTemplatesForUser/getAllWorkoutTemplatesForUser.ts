import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { GetAllWorkoutTemplatesForUserUsecase } from '@/application-layer/use-cases/workouttemplate/GetAllWorkoutTemplatesForUser/GetAllWorkoutTemplatesForUser.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppGetAllWorkoutTemplatesForUserUsecase =
  new GetAllWorkoutTemplatesForUserUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
