import { UserDTO } from "shared";

import {
  createUniqueUserProps,
  createUserInTestBackend,
  userTestProps,
} from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Authentication", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;

  beforeAll(async () => {
    backendService = new TestApplicationBackendService();

    const { user: createdUser } = await createUserInTestBackend(backendService);
    user = createdUser;
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

  it("should login user", async () => {
    const loginResponse = await backendService.loginUser(
      user.email,
      userTestProps.plainPassword,
    );

    expect(loginResponse.status).toBe("success");

    expect(typeof loginResponse.data).toBe("string");
    expect(loginResponse.data).toContain("success");
  });

  it("should not login if wrong credentials", async () => {
    const loginResponse = await backendService.loginUser(
      "wrongEmail@example.com",
      userTestProps.plainPassword,
    );

    expect(loginResponse.status).toBe("fail");
  });

  it("should logout", async () => {
    const logoutResponse = await backendService.logoutUser();

    expect(logoutResponse).toContain("out");
  });
});
