import { FindExerciseByFuzzyNameUsecase } from "../../../../application-layer/use-cases/exercise/FindExerciseByFuzzyName/FindExerciseByFuzzyNameUsecase";
import { AppExerciseFinderService } from "../../services/AppExerciseFinder";

export const AppFindExerciseByFuzzyNameUsecase =
  new FindExerciseByFuzzyNameUsecase(AppExerciseFinderService);
