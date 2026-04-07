import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";

export class MemoryExerciseFinder implements ExerciseFinder {
  constructor(private seed: ExerciseFinderResult[] = []) {}

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
