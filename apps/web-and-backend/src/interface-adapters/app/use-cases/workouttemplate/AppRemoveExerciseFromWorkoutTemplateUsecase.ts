import { AppWorkoutsTemplatesRepo } from '../../repos/AppWorkoutsTemplatesRepo';
import { RemoveExerciseFromWorkoutTemplateUsecase } from '../../../../application-layer/use-cases/workouttemplate/RemoveExerciseFromWorkoutTemplate/RemoveExerciseFromWorkoutTemplate.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppRemoveExerciseFromWorkoutTemplateUsecase =
  new RemoveExerciseFromWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
