import { ExerciseFinderResult } from "shared";

import { isTestingMobile } from "@/application-layer/utils/isTestRuntime";

import { mockExercisesForExerciseFinder } from "../../../../../tests/mocks/exercises";
import { ExerciseFinder } from "../../../../domain/services/ExerciseFinder.port";

export class MemoryExerciseFinder implements ExerciseFinder {
  constructor(private seed: ExerciseFinderResult[] = []) {
    if (isTestingMobile()) {
      this.seed = mockExercisesForExerciseFinder;
    }
  }

  async findExercisesByFuzzyName(
    name: string,
    _page = 1,
  ): Promise<ExerciseFinderResult[]> {
    const q = name.trim().toLowerCase();
    if (!q) return [];

    return this.seed.filter((item) =>
      (item.exercise.name || "").toLowerCase().includes(q),
    );
  }
}

export default MemoryExerciseFinder;
