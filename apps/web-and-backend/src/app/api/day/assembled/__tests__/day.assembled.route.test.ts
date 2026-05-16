import * as dayTestProps from "../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { Day } from "../../../../../domain/entities/day/Day";
import { User } from "../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "../../../../../infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "../../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryUsersRepo } from "../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "../../../../../interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "../../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppUsersRepo } from "../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { GET } from "../route";

describe("GET /api/day/assembled?ids=", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay1: Day;
  let testDay2: Day;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

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

    await daysRepo.saveDay(testDay1);
    await daysRepo.saveDay(testDay2);

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
