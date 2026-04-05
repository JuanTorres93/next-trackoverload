import { InfrastructureError } from "@/domain/common/errors";
import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";

// DOCS: https://wger.de/api/v2/
// SEARCH DOCS: https://wger.de/api/v2/exercise/search/
export const READ_RATE_LIMITS = {
  searchQueries: {
    requests: 30,
    perMinutes: 1,
  },
};

const BASE_URL = "https://wger.de";
const SEARCH_URL = `${BASE_URL}/api/v2/exercise/search/`;

export class WgerExerciseFinder implements ExerciseFinder {
  constructor() {}

  async findExercisesByFuzzyName(
    name: string,
  ): Promise<ExerciseFinderResult[]> {
    const url = `${SEARCH_URL}?term=${encodeURIComponent(name)}&language=english&format=json`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new InfrastructureError(
        `WgerExerciseFinder: Failed to fetch exercises by name "${name}". Status: ${response.status}`,
      );
    }

    const json = await response.json();

    return this.mapWgerSuggestionsToExerciseResults(
      json.suggestions || [],
      name,
    );
  }

  private mapWgerSuggestionsToExerciseResults(
    suggestions: WgerSuggestion[],
    searchName: string,
  ): ExerciseFinderResult[] {
    const query = searchName.toLowerCase().trim();

    // Deduplicate by base_id — wger can return the same exercise multiple times
    // when it has translations with different names that all match the search term
    const seen = new Set<number>();
    const unique = suggestions.filter(({ data }) => {
      if (seen.has(data.base_id)) return false;
      seen.add(data.base_id);
      return true;
    });

    const scored = unique.map((suggestion) => {
      const name = suggestion.data.name.toLowerCase();
      let score = 0;

      if (name === query) score += 100;
      else if (name.startsWith(query)) score += 40;
      else if (name.includes(query)) score += 20;

      // Penalize long names (usually compound/specific movements)
      score -= name.length * 0.5;

      return { suggestion, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.map(({ suggestion }) => ({
      exercise: { name: suggestion.data.name },
      externalRef: {
        externalId: String(suggestion.data.base_id),
        source: "wger",
      },
    }));
  }
}

type WgerSuggestion = {
  value: string;
  data: {
    id: number;
    base_id: number;
    name: string;
    category: string;
    image: string | null;
    image_thumbnail: string | null;
  };
};
