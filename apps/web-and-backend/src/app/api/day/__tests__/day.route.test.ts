import type { NextRequest } from "next/server";

import * as userTestProps from "../../../../../tests/createProps/userTestProps";
import { User } from "../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryUsersRepo } from "../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppUsersRepo } from "../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../__tests__/registerUserInAPITests";
import { CreateDayBody, POST } from "../route";

describe("POST /api/day", () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;

  let validBody: CreateDayBody;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    validBody = { targetUserId: user1Id, day: 1, month: 10, year: 2023 };

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request("http://localhost/api/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validBody }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request("http://localhost/api/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validBody }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should create a day and return 201", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request("http://localhost/api/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validBody }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty("id");
    expect(data.data).toHaveProperty("userId", user1Id);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request("http://localhost/api/day", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...validBody }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if targetUserId does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await POST(
        new Request("http://localhost/api/day", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...validBody, targetUserId: "non-existent" }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
