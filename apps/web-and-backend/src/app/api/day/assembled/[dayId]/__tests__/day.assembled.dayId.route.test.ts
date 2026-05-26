import * as dayTestProps from "../../../../../../../tests/createProps/dayTestProps";
import * as fakeMealTestProps from "../../../../../../../tests/createProps/fakeMealTestProps";
import * as mealTestProps from "../../../../../../../tests/createProps/mealTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../../../tests/repos/TestFakeMealsRepo";
import { TestMealsRepo } from "../../../../../../../tests/repos/TestMealsRepo";
import { TestUsersRepo } from "../../../../../../../tests/repos/TestUsersRepo";
import { Day } from "../../../../../../domain/entities/day/Day";
import { FakeMeal } from "../../../../../../domain/entities/fakemeal/FakeMeal";
import { Meal } from "../../../../../../domain/entities/meal/Meal";
import { User } from "../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { GET } from "../route";

describe("GET /api/day/assembled/[dayId]", () => {
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;
  let testFakeMeal: FakeMeal;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestMealsRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await TestMealsRepo.saveMeal(testMeal);

    testFakeMeal = fakeMealTestProps.createTestFakeMeal({ userId: user1Id });
    await TestFakeMealsRepo.saveFakeMeal(testFakeMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    testDay.addFakeMeal(testFakeMeal.id);
    await TestDaysRepo.saveDay(testDay);

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
