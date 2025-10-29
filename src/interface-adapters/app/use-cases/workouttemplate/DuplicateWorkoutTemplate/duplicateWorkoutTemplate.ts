import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { DuplicateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/DuplicateWorkoutTemplate/DuplicateWorkoutTemplate.usecase';

export const AppDuplicateWorkoutTemplateUsecase =
  new DuplicateWorkoutTemplateUsecase(AppWorkoutsTemplatesRepo);
