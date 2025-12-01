import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { DuplicateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/DuplicateWorkoutTemplate/DuplicateWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppDuplicateWorkoutTemplateUsecase =
  new DuplicateWorkoutTemplateUsecase(AppWorkoutsTemplatesRepo, AppUsersRepo);
