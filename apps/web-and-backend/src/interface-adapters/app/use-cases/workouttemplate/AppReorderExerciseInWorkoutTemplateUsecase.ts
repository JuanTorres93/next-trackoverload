import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { ReorderExerciseInWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/ReorderExerciseInWorkoutTemplate/ReorderExerciseInWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppReorderExerciseInWorkoutTemplateUsecase =
  new ReorderExerciseInWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
