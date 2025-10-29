import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { CreateWorkoutFromTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/CreateWorkoutFromTemplate/CreateWorkoutFromTemplate.usecase';

export const AppCreateWorkoutFromTemplateUsecase =
  new CreateWorkoutFromTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppWorkoutsRepo
  );
