import { RateLimitError } from "@/domain/common/errors";
import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";
import { RateLimiter } from "@/domain/services/RateLimiter.port";

export type FindExerciseByFuzzyNameRequest = {
  name: string;
  clientId: string;
  page?: number;
};

export class FindExerciseByFuzzyNameUsecase {
  constructor(
    private readonly exerciseFinder: ExerciseFinder,
    private readonly rateLimiter: RateLimiter,
  ) {}

  async execute(
    request: FindExerciseByFuzzyNameRequest,
  ): Promise<ExerciseFinderResult[]> {
    if (await this.rateLimiter.isRateLimited(request.clientId)) {
      throw new RateLimitError(
        "FindExerciseByFuzzyNameUsecase: Rate limit exceeded",
      );
    }

    const results = await this.exerciseFinder.findExercisesByFuzzyName(
      request.name,
      request.page,
    );

    await this.rateLimiter.recordRequest(request.clientId);

    return results;
  }
}
