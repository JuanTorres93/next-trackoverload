import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";

export type FindExerciseByFuzzyNameRequest = {
  name: string;
  clientId: string;
  page?: number;
};

export class FindExerciseByFuzzyNameUsecase {
  constructor(private readonly exerciseFinder: ExerciseFinder) {}

  async execute(
    request: FindExerciseByFuzzyNameRequest,
  ): Promise<ExerciseFinderResult[]> {
    const results = await this.exerciseFinder.findExercisesByFuzzyName(
      request.name,
      request.page,
    );

    return results;
  }
}
