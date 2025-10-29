import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { UpdateExerciseUsecase } from '@/application-layer/use-cases/exercise/UpdateExercise/UpdateExercise.usecase';

export const AppUpdateExerciseUsecase = new UpdateExerciseUsecase(
  AppExercisesRepo
);
