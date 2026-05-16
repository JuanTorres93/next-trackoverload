import { AppExercisesRepo } from '../../repos/AppExercisesRepo';
import { CreateExerciseUsecase } from '../../../../application-layer/use-cases/exercise/CreateExercise/CreateExercise.usecase';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';

export const AppCreateExerciseUsecase = new CreateExerciseUsecase(
  AppExercisesRepo,
  AppUuidV4IdGenerator
);
