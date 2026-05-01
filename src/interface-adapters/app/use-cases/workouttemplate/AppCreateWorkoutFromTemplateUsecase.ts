import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { CreateWorkoutFromTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/CreateWorkoutFromTemplate/CreateWorkoutFromTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppCreateWorkoutFromTemplateUsecase =
  new CreateWorkoutFromTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppWorkoutsRepo,
    AppUsersRepo,
    AppUuidV4IdGenerator
  );
