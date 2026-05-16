import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { UpdateExerciseInWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/UpdateExerciseInWorkoutTemplate/UpdateExerciseInWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppUpdateExerciseInWorkoutTemplateUsecase =
  new UpdateExerciseInWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
