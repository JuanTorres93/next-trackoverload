import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { CreateExerciseUsecase } from '@/application-layer/use-cases/exercise/CreateExercise/CreateExercise.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppCreateExerciseUsecase = new CreateExerciseUsecase(
  AppExercisesRepo,
  AppUuidV4IdGenerator
);
