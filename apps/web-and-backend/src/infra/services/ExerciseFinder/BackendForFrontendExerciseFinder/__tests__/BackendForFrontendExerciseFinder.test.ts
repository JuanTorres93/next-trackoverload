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

  it("should get only common exercises if userId is not provided", async () => {
    const results = await exerciseFinder.findExercisesByFuzzyName("press");

    expect(results.length).toBeGreaterThan(0);

    results.forEach((result) => {
      expect(result.exercise.userId).toBeUndefined();
    });
  });

  it("should get both common and user-specific exercises if userId is provided", async () => {
    const userId = "dd66e6d5-cdee-4055-848e-035b2c4ff901";

    const results = await exerciseFinder.findExercisesByFuzzyName(
      "press",
      1,
      userId,
    );

    expect(results.length).toBeGreaterThan(0);

    const hasUserSpecificExercises = results.some(
      (result) => result.exercise.userId === userId,
    );
    expect(hasUserSpecificExercises).toBe(true);
  });

  it("should paginate results", async () => {
    const userId = "dd66e6d5-cdee-4055-848e-035b2c4ff901";

    const page1Results = await exerciseFinder.findExercisesByFuzzyName(
      "press",
      1,
      userId,
    );
    const page2Results = await exerciseFinder.findExercisesByFuzzyName(
      "press",
      2,
      userId,
    );

    expect(page1Results.length).toBeGreaterThan(0);
    expect(page2Results.length).toBeGreaterThan(0);

    // Assuming the backend returns different results for different pages
    expect(page1Results[0].exercise.name).not.toBe(
      page2Results[0].exercise.name,
    );
  });
});
