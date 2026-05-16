import type { NextRequest } from "next/server";

import * as dayTestProps from "../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { Day } from "../../../../../domain/entities/day/Day";
import { User } from "../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryUsersRepo } from "../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppUsersRepo } from "../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { PUT } from "../route";

describe("PUT /api/day/[dayId] - set calories goal", () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await PUT(
      new Request(`http://localhost/api/day/${testDay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCaloriesGoal: 2000 }),
      }) as NextRequest,
      { params: Promise.resolve({ dayId: testDay.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should set calories goal and return updated day", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/day/${testDay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCaloriesGoal: 2000 }),
      }) as NextRequest,
      { params: Promise.resolve({ dayId: testDay.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testDay.id);
    expect(data.data).toHaveProperty("updatedCaloriesGoal", 2000);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(`http://localhost/api/day/${testDay.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newCaloriesGoal: 2000 }),
        }) as NextRequest,
        { params: Promise.resolve({ dayId: testDay.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});

describe("PUT /api/day/[dayId] - update weight", () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("should update weight and return updated day", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/day/${testDay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newWeightInKg: 75.5 }),
      }) as NextRequest,
      { params: Promise.resolve({ dayId: testDay.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testDay.id);
    expect(data.data).toHaveProperty("userWeightInKg", 75.5);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(`http://localhost/api/day/${testDay.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newWeightInKg: 75.5 }),
        }) as NextRequest,
        { params: Promise.resolve({ dayId: testDay.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
