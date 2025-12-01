import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { DeleteWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/DeleteWorkoutTemplate/DeleteWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppDeleteWorkoutTemplateUsecase = new DeleteWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo
);
