import { UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import {
  createUserInTestBackend,
  userTestProps,
} from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Day", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;

  beforeAll(async () => {
    backendService = new TestApplicationBackendService();

    const { user: createdUser } = await createUserInTestBackend(backendService);
    user = createdUser;

    await backendService.loginUser(user.email, userTestProps.plainPassword);
  });

  it("should create a day", async () => {
    const day = 1;
    const month = 1;
    const year = 2024;

    const createDayResponse = await backendService.createDay(
      day,
      month,
      year,
      user.id,
    );

    expect(createDayResponse.status).toBe("success");
    expect(createDayResponse.data).toHaveProperty("id");
  });
});
