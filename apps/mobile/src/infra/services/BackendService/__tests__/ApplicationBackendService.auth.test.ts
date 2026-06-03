import { UserDTO } from "shared/src/application-layer/dtos/UserDTO";

import { createUniqueUserProps } from "../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService - Authentication", () => {
  let backendService: TestApplicationBackendService;

  beforeEach(() => {
    backendService = new TestApplicationBackendService();
  });

  it("Creates a new user", async () => {
    const userTestProps = createUniqueUserProps();

    const response = await backendService.createUser(
      userTestProps.name,
      userTestProps.plainPassword,
      userTestProps.email,
    );

    const user = response!.data as UserDTO;

    expect(response.status).toBe("success");

    expect(user.name).toBe(userTestProps.name);
    expect(user.email).toBe(userTestProps.email);
  });
});
