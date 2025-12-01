import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { ReorderExerciseInWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/ReorderExerciseInWorkoutTemplate/ReorderExerciseInWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppReorderExerciseInWorkoutTemplateUsecase =
  new ReorderExerciseInWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
