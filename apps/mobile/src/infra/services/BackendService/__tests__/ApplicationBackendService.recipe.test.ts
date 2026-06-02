import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();
  });

  describe("Recipes", () => {
    it("should create recipe", async () => {
      const response = await backendService.getExerciseByFuzzyName("press");

      expect(response.status).toBe("success");
      expect(response!.data!.length).toBeGreaterThan(0);
    });
  });
});
