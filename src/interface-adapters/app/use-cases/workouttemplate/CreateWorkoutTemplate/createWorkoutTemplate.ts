import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { CreateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/CreateWorkoutTemplate/CreateWorkoutTemplate.usecase';

export const AppCreateWorkoutTemplateUsecase = new CreateWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo
);
