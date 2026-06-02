import { userTestProps } from "../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService - Authentication", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();

    // TODO clean data before each test. Create a test-only executable endpoint in the backend
  });

  it("Creates a new user", async () => {
    const response = await backendService.createUser(
      userTestProps.name,
      userTestProps.plainPassword,
      userTestProps.email,
    );

    expect(response.status).toBe("success");
  });
});
