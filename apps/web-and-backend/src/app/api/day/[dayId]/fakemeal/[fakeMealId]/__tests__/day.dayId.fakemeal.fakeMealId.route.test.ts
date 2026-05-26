import * as dayTestProps from "../../../../../../../../tests/createProps/dayTestProps";
import * as fakeMealTestProps from "../../../../../../../../tests/createProps/fakeMealTestProps";
import * as userTestProps from "../../../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../../../../tests/repos/TestFakeMealsRepo";
import { TestUsersRepo } from "../../../../../../../../tests/repos/TestUsersRepo";
import { Day } from "../../../../../../../domain/entities/day/Day";
import { FakeMeal } from "../../../../../../../domain/entities/fakemeal/FakeMeal";
import { User } from "../../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../../__tests__/registerUserInAPITests";
import { DELETE } from "../route";

describe("DELETE /api/day/[dayId]/fakemeal/[fakeMealId]", () => {
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testFakeMeal: FakeMeal;

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testFakeMeal = fakeMealTestProps.createTestFakeMeal({ userId: user1Id });
    await TestFakeMealsRepo.saveFakeMeal(testFakeMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addFakeMeal(testFakeMeal.id);
    await TestDaysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await DELETE(
      new Request(
        `http://localhost/api/day/${testDay.id}/fakemeal/${testFakeMeal.id}`,
      ),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          fakeMealId: testFakeMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should remove fake meal from day", async () => {
    await loginInAPITests(user1.email);

    const response = await DELETE(
      new Request(
        `http://localhost/api/day/${testDay.id}/fakemeal/${testFakeMeal.id}`,
      ),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          fakeMealId: testFakeMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.fakeMealIds).toHaveLength(0);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await DELETE(
        new Request(
          `http://localhost/api/day/${testDay.id}/fakemeal/${testFakeMeal.id}`,
        ),
        {
          params: Promise.resolve({
            dayId: testDay.id,
            fakeMealId: testFakeMeal.id,
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
        new Request(
          `http://localhost/api/day/20991231/fakemeal/${testFakeMeal.id}`,
        ),
        {
          params: Promise.resolve({
            dayId: "20991231",
            fakeMealId: testFakeMeal.id,
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
