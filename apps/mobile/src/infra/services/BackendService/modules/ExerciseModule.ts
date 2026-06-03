import { ExerciseFinderResult, JSENDResponse } from "shared";

export class ExerciseModule {
  constructor(private baseUrl: string) {}

  async getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>> {
    const response = await fetch(`${this.baseUrl}/exercise/fuzzy/${name}`);

    const jsend = await response.json();

    return jsend;
  }
}
