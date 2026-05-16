import { AppExercisesRepo } from '../../repos/AppExercisesRepo';
import { GetExercisesByIdsUsecase } from '../../../../application-layer/use-cases/exercise/GetExercisesByIds/GetExercisesByIds.usecase';

export const AppGetExercisesByIdsUsecase = new GetExercisesByIdsUsecase(
  AppExercisesRepo
);
