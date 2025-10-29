import { AppExercisesRepo } from '@/interface-adapters/app/repos/AppExercisesRepo';
import { GetAllExercisesUsecase } from '@/application-layer/use-cases/exercise/GetAllExercises/GetAllExercises.usecase';

export const AppGetAllExercisesUsecase = new GetAllExercisesUsecase(
  AppExercisesRepo
);
