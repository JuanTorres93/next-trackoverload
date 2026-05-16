import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { UpdateWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/UpdateWorkoutTemplate/UpdateWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppUpdateWorkoutTemplateUsecase = new UpdateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo
);
