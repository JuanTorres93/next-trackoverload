import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { UpdateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/UpdateWorkoutTemplate/UpdateWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppUpdateWorkoutTemplateUsecase = new UpdateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo
);
