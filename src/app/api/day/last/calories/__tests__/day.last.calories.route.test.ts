import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Day } from "@/domain/entities/day/Day";
import { User } from "@/domain/entities/user/User";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as dayTestProps from "../../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { GET } from "../route";

describe("GET /api/day/last/calories", () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

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
    await daysRepo.saveDay(dayWithCalories);

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
