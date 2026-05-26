import * as dayTestProps from "../../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../../tests/repos/TestDaysRepo";
import { TestUsersRepo } from "../../../../../../../tests/repos/TestUsersRepo";
import { Day } from "../../../../../../domain/entities/day/Day";
import { User } from "../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { GET } from "../route";

describe("GET /api/day/last/calories", () => {
  let user1: User;
  let user1Id: string;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await GET(
      new Request("http://localhost/api/day/last/calories"),
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return null when no day with calories goal exists", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request("http://localhost/api/day/last/calories"),
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeNull();
  });

  it("should return the last day with a calories goal", async () => {
    await loginInAPITests(user1.email);

    const dayWithCalories: Day = dayTestProps.createEmptyTestDay({
      userId: user1Id,
    });
    dayWithCalories.updateCaloriesGoal(2000);
    await TestDaysRepo.saveDay(dayWithCalories);

    const response = await GET(
      new Request("http://localhost/api/day/last/calories"),
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).not.toBeNull();
    expect(data.data).toHaveProperty("updatedCaloriesGoal", 2000);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await GET(
        new Request("http://localhost/api/day/last/calories"),
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
