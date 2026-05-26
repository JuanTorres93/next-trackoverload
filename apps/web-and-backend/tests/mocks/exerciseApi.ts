import { vi } from "vitest";

import { ExerciseFinderResult } from "../../src/domain/services/ExerciseFinder.port";
import { mockExercisesForExerciseFinder } from "./exercises";

export function mockExerciseApiFetch(options?: {
  fuzzyResolver?: FuzzyResolver;
}) {
  const fuzzyResolver = options?.fuzzyResolver ?? lowerCaseFuzzyResolver;

  vi.spyOn(global, "fetch").mockImplementation((input) => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.includes("/api/exercise/fuzzy/")) {
      const [path, query] = url.split("/api/exercise/fuzzy/")[1].split("?");

      const term = decodeURIComponent(path);
      const page = parseInt(
        new URLSearchParams(query ?? "").get("page") ?? "1",
        10,
      );

      const data = fuzzyResolver(term, page);

      return Promise.resolve(
        new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}

type FuzzyResolver = (term: string, page: number) => ExerciseFinderResult[];

function lowerCaseFuzzyResolver(term: string): ExerciseFinderResult[] {
  return mockExercisesForExerciseFinder.filter((e) =>
    e.exercise.name.toLowerCase().includes(term.toLowerCase()),
  );
}
