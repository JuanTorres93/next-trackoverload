import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { GetExercisesByIdsUsecase } from '@/application-layer/use-cases/exercise/GetExercisesByIds/GetExercisesByIds.usecase';

export const AppGetExercisesByIdsUsecase = new GetExercisesByIdsUsecase(
  AppExercisesRepo
);
