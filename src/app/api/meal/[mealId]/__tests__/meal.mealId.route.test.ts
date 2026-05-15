import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Meal } from "@/domain/entities/meal/Meal";
import { User } from "@/domain/entities/user/User";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppMealsRepo } from "@/interface-adapters/app/repos/AppMealsRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as mealTestProps from "../../../../../../tests/createProps/mealTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { PUT } from "../route";

describe("PUT /api/meal/[mealId]", () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;

  let user1: User;
  let user1Id: string;
  let testMeal: Meal;

  beforeEach(async () => {
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    mealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await PUT(
      new Request(`http://localhost/api/meal/${testMeal.id}`, {
        method: "PUT",
      }),
      { params: Promise.resolve({ mealId: testMeal.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/meal/${testMeal.id}`, {
        method: "PUT",
      }),
      { params: Promise.resolve({ mealId: testMeal.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should toggle isEaten from falsy to true", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/meal/${testMeal.id}`, {
        method: "PUT",
      }),
      { params: Promise.resolve({ mealId: testMeal.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testMeal.id);
    expect(data.data).toHaveProperty("isEaten", true);
  });

  it("should toggle isEaten back to false on second call", async () => {
    await loginInAPITests(user1.email);

    await PUT(
      new Request(`http://localhost/api/meal/${testMeal.id}`, {
        method: "PUT",
      }),
      { params: Promise.resolve({ mealId: testMeal.id }) },
    );

    const response = await PUT(
      new Request(`http://localhost/api/meal/${testMeal.id}`, {
        method: "PUT",
      }),
      { params: Promise.resolve({ mealId: testMeal.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testMeal.id);
    expect(data.data).toHaveProperty("isEaten", false);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(`http://localhost/api/meal/${testMeal.id}`, {
          method: "PUT",
        }),
        { params: Promise.resolve({ mealId: testMeal.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if meal does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await PUT(
        new Request("http://localhost/api/meal/non-existent-meal", {
          method: "PUT",
        }),
        { params: Promise.resolve({ mealId: "non-existent-meal" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
