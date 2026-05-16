import { ExerciseFinder } from "../../../domain/services/ExerciseFinder.port";
import { BackendForFrontendExerciseFinder } from "../../../infra/services/ExerciseFinder/BackendForFrontendExerciseFinder/BackendForFrontendExerciseFinder";
import MemoryExerciseFinder from "../../../infra/services/ExerciseFinder/MemoryExerciseFinder/MemoryExerciseFinder";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

const AppExerciseFinderService: ExerciseFinder =
  await injectFor_ProductionDevelopment_Test<ExerciseFinder>(
    BackendForFrontendExerciseFinder,
    MemoryExerciseFinder,
  );

export { AppExerciseFinderService };
