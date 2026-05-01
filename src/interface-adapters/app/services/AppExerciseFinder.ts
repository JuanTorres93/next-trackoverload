import { BackendForFrontendExerciseFinder } from "@/infra/services/ExerciseFinder/BackendForFrontendExerciseFinder/BackendForFrontendExerciseFinder";
import MemoryExerciseFinder from "@/infra/services/ExerciseFinder/MemoryExerciseFinder/MemoryExerciseFinder";

let AppExerciseFinderService:
  | BackendForFrontendExerciseFinder
  | MemoryExerciseFinder;

if (process.env.NODE_ENV === "test") {
  AppExerciseFinderService = new MemoryExerciseFinder();
} else {
  AppExerciseFinderService = new BackendForFrontendExerciseFinder();
}

export { AppExerciseFinderService };
