import * as dayTestProps from "../../../../../../../../tests/createProps/dayTestProps";
import * as mealTestProps from "../../../../../../../../tests/createProps/mealTestProps";
import * as userTestProps from "../../../../../../../../tests/createProps/userTestProps";
import { Day } from "../../../../../../../domain/entities/day/Day";
import { Meal } from "../../../../../../../domain/entities/meal/Meal";
import { User } from "../../../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryMealsRepo } from "../../../../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryUsersRepo } from "../../../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppMealsRepo } from "../../../../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppUsersRepo } from "../../../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../../__tests__/registerUserInAPITests";
import { DELETE } from "../route";

describe("DELETE /api/day/[dayId]/meal/[mealId]", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await DELETE(
      new Request(`http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should remove meal from day", async () => {
    await loginInAPITests(user1.email);

    const response = await DELETE(
      new Request(`http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.mealIds).toHaveLength(0);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await DELETE(
        new Request(
          `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
        ),
        {
          params: Promise.resolve({
            dayId: testDay.id,
            mealId: testMeal.id,
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if day does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await DELETE(
        new Request(`http://localhost/api/day/20991231/meal/${testMeal.id}`),
        {
          params: Promise.resolve({
            dayId: "20991231",
            mealId: testMeal.id,
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
