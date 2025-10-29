import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { GetAllWorkoutTemplatesForUserUsecase } from '@/application-layer/use-cases/workouttemplate/GetAllWorkoutTemplatesForUser/GetAllWorkoutTemplatesForUser.usecase';

export const AppGetAllWorkoutTemplatesForUserUsecase =
  new GetAllWorkoutTemplatesForUserUsecase(AppWorkoutsTemplatesRepo);
