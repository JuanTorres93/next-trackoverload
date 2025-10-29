import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { DeleteWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/DeleteWorkoutTemplate/DeleteWorkoutTemplate.usecase';

export const AppDeleteWorkoutTemplateUsecase = new DeleteWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo
);
