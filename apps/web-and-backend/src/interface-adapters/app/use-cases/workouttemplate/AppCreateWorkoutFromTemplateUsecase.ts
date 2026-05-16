import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { AppWorkoutsRepo } from '../../repos/AppWorkoutsRepo';
import { CreateWorkoutFromTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/CreateWorkoutFromTemplate/CreateWorkoutFromTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';

export const AppCreateWorkoutFromTemplateUsecase =
  new CreateWorkoutFromTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppWorkoutsRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator
  );
