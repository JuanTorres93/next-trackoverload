import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { CreateExerciseUsecase } from '@/application-layer/use-cases/exercise/CreateExercise/CreateExercise.usecase';

export const AppCreateExerciseUsecase = new CreateExerciseUsecase(
  AppExercisesRepo
);
