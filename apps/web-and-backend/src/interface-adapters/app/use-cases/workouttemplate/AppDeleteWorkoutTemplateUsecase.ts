import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { DeleteWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/DeleteWorkoutTemplate/DeleteWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppDeleteWorkoutTemplateUsecase = new DeleteWorkoutTemplateUsecase(
  AppWorkoutsTemplatesRepo,
  AppUsersRepo
);
