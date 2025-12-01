import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { CreateWorkoutFromTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/CreateWorkoutFromTemplate/CreateWorkoutFromTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppCreateWorkoutFromTemplateUsecase =
  new CreateWorkoutFromTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppWorkoutsRepo,
    AppUsersRepo
  );
