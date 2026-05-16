import type { NextRequest } from "next/server";

import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { User } from "../../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "../../../../../../infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryUsersRepo } from "../../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "../../../../../../interface-adapters/app/repos/AppFakeMealsRepo";
import { AppUsersRepo } from "../../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { POST } from "../route";

describe("POST /api/day/[dayId]/fakemeal", () => {
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;

  const testDayId = "20231001";

  const validBody = { name: "Quick snack", calories: 300, protein: 15 };

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request(`http://localhost/api/day/${testDayId}/fakemeal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }) as NextRequest,
      { params: Promise.resolve({ dayId: testDayId }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should add fake meal to day and return 201", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request(`http://localhost/api/day/${testDayId}/fakemeal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }) as NextRequest,
      { params: Promise.resolve({ dayId: testDayId }) },
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.fakeMealIds).toHaveLength(1);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request(`http://localhost/api/day/${testDayId}/fakemeal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validBody),
        }) as NextRequest,
        { params: Promise.resolve({ dayId: testDayId }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
