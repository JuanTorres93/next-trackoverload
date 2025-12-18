import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { DuplicateWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/DuplicateWorkoutTemplate/DuplicateWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppDuplicateWorkoutTemplateUsecase =
  new DuplicateWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator
  );
