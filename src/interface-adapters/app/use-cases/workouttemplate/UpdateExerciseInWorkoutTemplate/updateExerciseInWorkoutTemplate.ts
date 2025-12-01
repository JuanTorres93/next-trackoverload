import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { UpdateExerciseInWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/UpdateExerciseInWorkoutTemplate/UpdateExerciseInWorkoutTemplate.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppUpdateExerciseInWorkoutTemplateUsecase =
  new UpdateExerciseInWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppUsersRepo
  );
