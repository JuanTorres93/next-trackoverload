import { JSENDSuccess } from "@/app/_types/JSEND";
import { InfrastructureError } from "@/domain/common/errors";
import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";

export class BackendForFrontendExerciseFinder implements ExerciseFinder {
  private readonly backendUrl: string;

  constructor() {
    this.backendUrl = "https://db-exercises.onrender.com";
  }

  async findExercisesByFuzzyName(
    name: string,
    _page?: number,
    userId?: string,
  ): Promise<ExerciseFinderResult[]> {
    const url = `${this.backendUrl}/exercises/${encodeURIComponent(name)}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new InfrastructureError(
        `BackendForFrontendExerciseFinder: Failed to fetch exercises by name "${name}". Status: ${response.status}`,
      );
    }

    const jsonResponse: JSENDSuccess<ExerciseFromAPI[]> = await response.json();

    const exercisesFromAPI = jsonResponse.data;

    const exerciseFinderResults = exercisesFromAPI.map(
      this.mapToExerciseFinderResult,
    );

    return exerciseFinderResults;
  }

  private mapToExerciseFinderResult(
    exerciseFromAPI: ExerciseFromAPI,
  ): ExerciseFinderResult {
    const exercise: ExerciseFinderResult["exercise"] = {
      name: exerciseFromAPI.name,
    };

    const externalRef: ExerciseFinderResult["externalRef"] = {
      externalId: exerciseFromAPI.id,
      source: "backend-for-frontend",
    };

    return {
      exercise,
      externalRef,
    };
  }
}

type ExerciseFromAPI = {
  id: string;
  name: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
};
