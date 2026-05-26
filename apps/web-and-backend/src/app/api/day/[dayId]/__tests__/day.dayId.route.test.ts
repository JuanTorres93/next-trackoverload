import type { NextRequest } from "next/server";

import * as dayTestProps from "../../../../../../tests/createProps/dayTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../tests/repos/TestDaysRepo";
import { TestUsersRepo } from "../../../../../../tests/repos/TestUsersRepo";
import { Day } from "../../../../../domain/entities/day/Day";
import { User } from "../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { PUT } from "../route";

describe("PUT /api/day/[dayId] - set calories goal", () => {
  let user1: User;
  let user1Id: string;
  let testDay: Day;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    await TestDaysRepo.saveDay(testDay);

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
  let user1: User;
  let user1Id: string;
  let testDay: Day;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    await TestDaysRepo.saveDay(testDay);

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
