import type { NextRequest } from "next/server";

import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../../../tests/repos/TestFakeMealsRepo";
import { TestUsersRepo } from "../../../../../../../tests/repos/TestUsersRepo";
import { User } from "../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { POST } from "../route";

describe("POST /api/day/[dayId]/fakemeal", () => {
  let user1: User;

  const testDayId = "20231001";

  const validBody = { name: "Quick snack", calories: 300, protein: 15 };

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);

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
