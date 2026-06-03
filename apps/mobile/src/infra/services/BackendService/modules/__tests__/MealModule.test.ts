import { ExerciseFinderResult } from "shared";

import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Exercises", () => {
  let backendService: TestApplicationBackendService;

  beforeAll(() => {
    backendService = new TestApplicationBackendService();
  });

  describe("Exercises", () => {
    it("should return exercises by fuzzy name", async () => {
      const response = await backendService.getExerciseByFuzzyName("press");

      expect(response.status).toBe("success");
      expect(response!.data!.length).toBeGreaterThan(0);
    });

    it("should return array of ExerciseFinderResult", async () => {
      const response = await backendService.getExerciseByFuzzyName("press");

      expect(response.status).toBe("success");

      const data = response!.data as ExerciseFinderResult[];

      expect(data[0]).toHaveProperty("exercise");
      expect(data[0]).toHaveProperty("externalRef");
    });
  });
});
