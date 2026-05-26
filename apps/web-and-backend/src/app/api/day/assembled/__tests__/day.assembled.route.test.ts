import * as dayTestProps from "../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../../tests/repos/TestFakeMealsRepo";
import { TestMealsRepo } from "../../../../../../tests/repos/TestMealsRepo";
import { TestUsersRepo } from "../../../../../../tests/repos/TestUsersRepo";
import { Day } from "../../../../../domain/entities/day/Day";
import { User } from "../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { GET } from "../route";

describe("GET /api/day/assembled?ids=", () => {
  let user1: User;
  let user1Id: string;
  let testDay1: Day;
  let testDay2: Day;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestMealsRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testDay1 = dayTestProps.createEmptyTestDay({
      userId: user1Id,
      day: 1,
      month: 10,
      year: 2023,
    });
    testDay2 = dayTestProps.createEmptyTestDay({
      userId: user1Id,
      day: 2,
      month: 10,
      year: 2023,
    });

    await TestDaysRepo.saveDay(testDay1);
    await TestDaysRepo.saveDay(testDay2);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/day/assembled?ids=${testDay1.id},${testDay2.id}`,
      ) as Parameters<typeof GET>[0],
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return assembled days for given ids", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(
        `http://localhost/api/day/assembled?ids=${testDay1.id},${testDay2.id}`,
      ) as Parameters<typeof GET>[0],
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
  });

  it("should return empty array when no ids are found", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(
        "http://localhost/api/day/assembled?ids=20991231,20991230",
      ) as Parameters<typeof GET>[0],
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await GET(
        new Request(
          `http://localhost/api/day/assembled?ids=${testDay1.id}`,
        ) as Parameters<typeof GET>[0],
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
