import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { DuplicateWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/DuplicateWorkoutTemplate/DuplicateWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';

export const AppDuplicateWorkoutTemplateUsecase =
  new DuplicateWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator
  );
