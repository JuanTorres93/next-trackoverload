import { FindExerciseByFuzzyNameUsecase } from "@/application-layer/use-cases/exercise/FindExerciseByFuzzyName/FindExerciseByFuzzyNameUsecase";
import { AppExerciseFinderService } from "@/interface-adapters/app/services/AppExerciseFinder";

export const AppFindExerciseByFuzzyNameUsecase =
  new FindExerciseByFuzzyNameUsecase(AppExerciseFinderService);
