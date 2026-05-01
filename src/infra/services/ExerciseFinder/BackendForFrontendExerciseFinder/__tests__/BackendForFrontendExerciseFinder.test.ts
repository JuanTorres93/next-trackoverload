import { BackendForFrontendExerciseFinder } from "../BackendForFrontendExerciseFinder";

describe("BackendForFrontendExerciseFinder", () => {
  let exerciseFinder: BackendForFrontendExerciseFinder;

  beforeEach(() => {
    exerciseFinder = new BackendForFrontendExerciseFinder();
  });

  it("should return array of ExerciseFinderResults", async () => {
    const results = await exerciseFinder.findExercisesByFuzzyName("press");

    expect(results).toBeInstanceOf(Array);

    const firstResult = results[0];

    expect(firstResult).toHaveProperty("exercise");
    expect(firstResult).toHaveProperty("externalRef");
  });

  it("should fetch exercises by fuzzy name", async () => {
    const results = await exerciseFinder.findExercisesByFuzzyName("press");

    expect(results.length).toBeGreaterThan(0);
  });
});
