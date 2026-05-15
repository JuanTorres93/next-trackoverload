import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { User } from "@/domain/entities/user/User";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { GET } from "../route";

describe("GET /api/day/last/[numberOfDays]", () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await GET(new Request("http://localhost/api/day/last/7"), {
      params: Promise.resolve({ numberOfDays: "7" }),
    });

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return N day entries including non-existent days", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(new Request("http://localhost/api/day/last/7"), {
      params: Promise.resolve({ numberOfDays: "7" }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(7);
  });

  it("each entry should have a date field", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(new Request("http://localhost/api/day/last/3"), {
      params: Promise.resolve({ numberOfDays: "3" }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    for (const entry of data.data) {
      expect(entry).toHaveProperty("date");
    }
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await GET(
        new Request("http://localhost/api/day/last/7"),
        { params: Promise.resolve({ numberOfDays: "7" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
