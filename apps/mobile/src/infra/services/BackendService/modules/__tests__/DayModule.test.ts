import { UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import { createUniqueUserProps } from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe.only("ApplicationBackendService - Day", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;

  beforeAll(async () => {
    backendService = new TestApplicationBackendService();

    // TODO NEXT: create function to DRY this logic
    const userTestProps = createUniqueUserProps();
    const userResponse = await backendService.createUser(
      userTestProps.name,
      userTestProps.plainPassword,
      userTestProps.email,
    );
    user = userResponse.data as UserDTO;

    await backendService.loginUser(
      userTestProps.email,
      userTestProps.plainPassword,
    );
  });

  it("should create a day", async () => {
    const day = 1;
    const month = 1;
    const year = 2024;
    const userId = user.id;

    const createDayResponse = await backendService.createDay(
      day,
      month,
      year,
      userId,
    );

    expect(createDayResponse.status).toBe("success");
    expect(createDayResponse.data).toHaveProperty("id");
  });
});
