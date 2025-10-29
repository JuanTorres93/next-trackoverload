import { AppWorkoutsTemplatesRepo } from '@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo';
import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { AddExerciseToWorkoutTemplateUsecase } from '@/application-layer/use-cases/workouttemplate/AddExerciseToWorkoutTemplate/AddExerciseToWorkoutTemplate.usecase';

export const AppAddExerciseToWorkoutTemplateUsecase =
  new AddExerciseToWorkoutTemplateUsecase(
    AppWorkoutsTemplatesRepo,
    AppExercisesRepo
  );
