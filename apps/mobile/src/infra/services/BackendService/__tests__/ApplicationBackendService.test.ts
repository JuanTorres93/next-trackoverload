import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();
  });

  describe("Exercises", () => {
    it("should return exercises by fuzzy name", async () => {
      const response = await backendService.getExerciseByFuzzyName("press");

      expect(response.status).toBe("success");
      expect(response.data.length).toBeGreaterThan(0);
    });
  });
});
