import { AppExercisesRepo } from '../../repos/AppExercisesRepo';
import { GetExerciseByIdUsecase } from '../../../../application-layer/use-cases/exercise/GetExerciseById/GetExerciseById.usecase';

export const AppGetExerciseByIdUsecase = new GetExerciseByIdUsecase(
  AppExercisesRepo
);
