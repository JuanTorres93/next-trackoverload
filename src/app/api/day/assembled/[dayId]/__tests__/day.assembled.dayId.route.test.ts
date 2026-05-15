import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Day } from "@/domain/entities/day/Day";
import { FakeMeal } from "@/domain/entities/fakemeal/FakeMeal";
import { Meal } from "@/domain/entities/meal/Meal";
import { User } from "@/domain/entities/user/User";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "@/infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "@/interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "@/interface-adapters/app/repos/AppMealsRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as dayTestProps from "../../../../../../../tests/createProps/dayTestProps";
import * as fakeMealTestProps from "../../../../../../../tests/createProps/fakeMealTestProps";
import * as mealTestProps from "../../../../../../../tests/createProps/mealTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { GET } from "../route";

describe("GET /api/day/assembled/[dayId]", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;
  let testFakeMeal: FakeMeal;

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

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    testFakeMeal = fakeMealTestProps.createTestFakeMeal({ userId: user1Id });
    await fakeMealsRepo.saveFakeMeal(testFakeMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    testDay.addFakeMeal(testFakeMeal.id);
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await GET(
      new Request(`http://localhost/api/day/assembled/${testDay.id}`),
      { params: Promise.resolve({ dayId: testDay.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return the assembled day with meals and fake meals", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(`http://localhost/api/day/assembled/${testDay.id}`),
      { params: Promise.resolve({ dayId: testDay.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testDay.id);
    expect(data.data.meals).toHaveLength(1);
    expect(data.data.fakeMeals).toHaveLength(1);
  });

  it("should return null for a non-existent day", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request("http://localhost/api/day/assembled/20991231"),
      { params: Promise.resolve({ dayId: "20991231" }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeNull();
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await GET(
        new Request(`http://localhost/api/day/assembled/${testDay.id}`),
        { params: Promise.resolve({ dayId: testDay.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
