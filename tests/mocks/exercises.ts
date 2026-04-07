import { ExerciseFinderResult } from "@/domain/services/ExerciseFinder.port";

export const mockExercisesForExerciseFinder: ExerciseFinderResult[] = [
  {
    exercise: { name: "Bench Press" },
    externalRef: { externalId: "ext-ex-1", source: "wger" },
  },
  {
    exercise: { name: "Incline Bench Press" },
    externalRef: { externalId: "ext-ex-2", source: "wger" },
  },
  {
    exercise: { name: "Squat" },
    externalRef: { externalId: "ext-ex-3", source: "wger" },
  },
];
