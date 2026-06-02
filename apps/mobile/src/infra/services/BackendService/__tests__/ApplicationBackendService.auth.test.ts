import { userTestProps } from "../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService - Authentication", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();
  });

  it("Creates a new user", async () => {
    const noDuplicate = crypto.randomUUID();

    const email = `${noDuplicate}-${userTestProps.email}`;

    const response = await backendService.createUser(
      userTestProps.name,
      userTestProps.plainPassword,
      email,
    );

    expect(response.status).toBe("success");
  });
});
