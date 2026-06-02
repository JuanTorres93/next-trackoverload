import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();
  });

  describe("Messages", () => {
    it("MOCK TEST: DELETE OR CHANGE", async () => {
      const response = await backendService.getExerciseByFuzzyName("test");
    });
  });
});
