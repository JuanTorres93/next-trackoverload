import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { RemoveExerciseFromWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/RemoveExerciseFromWorkoutTemplate/RemoveExerciseFromWorkoutTemplate.usecase';

export const AppRemoveExerciseFromWorkoutTemplateUsecase =
  new RemoveExerciseFromWorkoutTemplateUsecase(AppWorkoutsTemplatesRepo);
