import { AppExercisesRepo } from '../../repos/AppExercisesRepo';
import { DeleteExerciseUsecase } from '../../../../application-layer/use-cases/exercise/DeleteExercise/DeleteExercise.usecase';

export const AppDeleteExerciseUsecase = new DeleteExerciseUsecase(
  AppExercisesRepo
);
