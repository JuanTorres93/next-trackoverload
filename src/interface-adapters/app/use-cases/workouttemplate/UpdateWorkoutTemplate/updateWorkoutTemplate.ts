import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { UpdateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/UpdateWorkoutTemplate/UpdateWorkoutTemplate.usecase';

export const AppUpdateWorkoutTemplateUsecase = new UpdateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo
);
