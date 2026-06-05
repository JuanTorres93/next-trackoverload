import { DayDTO, RecipeDTO, UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import { createRecipeInTestBackend } from "../../../../../../tests/mocks/recipe";
import {
  createUserInTestBackend,
  userTestProps,
} from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Day", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;

  let recipe: RecipeDTO;
  let otherRecipe: RecipeDTO;

  beforeAll(async () => {
    backendService = new TestApplicationBackendService();

    const { user: createdUser } = await createUserInTestBackend(backendService);
    user = createdUser;

    await backendService.loginUser(user.email, userTestProps.plainPassword);

    const { recipe: createdRecipe } = await createRecipeInTestBackend(
      backendService,
      user.id,
    );
    recipe = createdRecipe;

    const { recipe: createdOtherRecipe } = await createRecipeInTestBackend(
      backendService,
      user.id,
      {
        recipeName: "Other Test Recipe",
      },
    );
    otherRecipe = createdOtherRecipe;
  });

  it("should create a day", async () => {
    const day = 1;
    const month = 1;
    const year = 2024;

    const createDayResponse = await backendService.createDay(
      day,
      month,
      year,
      user.id,
    );

    expect(createDayResponse.status).toBe("success");
    expect(createDayResponse.data).toHaveProperty("id");
  });

  it("should add multiple meals to multiple days", async () => {
    const dayResponse = await backendService.createDay(1, 1, 1990, user.id);
    const otherDayResponse = await backendService.createDay(
      2,
      1,
      1990,
      user.id,
    );

    const day = dayResponse.data as DayDTO;
    const otherDay = otherDayResponse.data as DayDTO;

    const addMealsResponse =
      await backendService.addMultipleMealsToMultipleDays(
        [recipe.id, otherRecipe.id],
        [day.id, otherDay.id],
        user.id,
      );

    expect(addMealsResponse.status).toBe("success");

    const updatedDays = addMealsResponse.data as DayDTO[];

    const updatedDay = updatedDays.find((d) => d.id === day.id);
    const updatedOtherDay = updatedDays.find((d) => d.id === otherDay.id);

    expect(updatedDay).toBeDefined();
    expect(updatedOtherDay).toBeDefined();

    expect(updatedDay?.mealIds.length).toBeGreaterThanOrEqual(2);
    expect(updatedOtherDay?.mealIds.length).toBeGreaterThanOrEqual(2);
  });

  it("should return the last day with a calories goal", async () => {
    const response = await backendService.getLastDayWithCaloriesGoal();

    expect(response.status).toBe("success");

    // TODO IMPORTANT: CHeck calories goal value once that feature is implemented
  });

  it("should return the last N days including non-existent ones", async () => {
    const numberOfDays = 7;

    const response = await backendService.getLastNumberOfDays(numberOfDays);

    expect(response.status).toBe("success");
    expect(response.data).toHaveLength(numberOfDays);
  });

  it("should set calories goal", async () => {
    const createdDayResp = await backendService.createDay(1, 1, 1994, user.id);
    expect(createdDayResp.status).toBe("success");

    const createdDay = createdDayResp.data as DayDTO;

    const setCalResp = await backendService.setCaloriesGoalForDayAndUser(
      createdDay.id,
      user.id,
      2000,
    );

    expect(setCalResp.status).toBe("success");
    expect(setCalResp.data).toHaveProperty("updatedCaloriesGoal", 2000);
  });

  it("should update user weight for day", async () => {
    const createdDayResp = await backendService.createDay(2, 1, 2024, user.id);
    const createdDay = createdDayResp.data as DayDTO;

    const updateResp = await backendService.updateUserWeightForDay(
      createdDay.id,
      user.id,
      75,
    );

    expect(updateResp.status).toBe("success");
    expect(updateResp.data).toHaveProperty("userWeightInKg", 75);
  });

  it("should add and remove meals", async () => {
    const createdDayResp = await backendService.createDay(3, 1, 2024, user.id);
    const createdDay = createdDayResp.data as DayDTO;

    const addResp = await backendService.addMultipleMealsToDay(createdDay.id, [
      recipe.id,
    ]);

    expect(addResp.status).toBe("success");
    expect(addResp.data).toHaveProperty("mealIds");
    expect(addResp.data!.mealIds.length).toBeGreaterThanOrEqual(1);

    const dayAfterAdd = addResp.data as DayDTO;
    const mealId = dayAfterAdd.mealIds[0];

    const removeResp = await backendService.removeMealFromDay(
      createdDay.id,
      mealId,
    );
    expect(removeResp.status).toBe("success");
    expect(removeResp.data).toHaveProperty("mealIds");
    expect(removeResp.data!.mealIds.length).toBe(0);
  });

  it("should add and remove fake meal", async () => {
    const createdDayResp = await backendService.createDay(4, 1, 2024, user.id);
    const createdDay = createdDayResp.data as DayDTO;

    const addFakeResp = await backendService.addFakeMealToDay(
      createdDay.id,
      "Test Fake",
      100,
      5,
    );

    expect(addFakeResp.status).toBe("success");
    expect(addFakeResp.data).toHaveProperty("fakeMealIds");
    expect(addFakeResp.data!.fakeMealIds.length).toBe(1);

    const dayAfterAdd = addFakeResp.data as DayDTO;
    const fakeMealId = dayAfterAdd.fakeMealIds[0];

    const removeFakeResp = await backendService.removeFakeMealFromDay(
      createdDay.id,
      fakeMealId,
    );

    expect(removeFakeResp.status).toBe("success");
    expect(removeFakeResp.data!.fakeMealIds.length).toBe(0);
  });

  it("should get assembled day by id", async () => {
    const createdDayResp = await backendService.createDay(5, 1, 2024, user.id);
    const createdDay = createdDayResp.data as DayDTO;

    const assembledResp = await backendService.getAssembledDayById(
      createdDay.id,
    );
    expect(assembledResp.status).toBe("success");
    expect(assembledResp.data).toHaveProperty("meals");
  });

  it("should return null for non-existent assembled day id", async () => {
    const assembledResp =
      await backendService.getAssembledDayById("non-existent-id");

    expect(assembledResp.status).toBe("success");
    expect(assembledResp.data).toBeNull();
  });

  it("should get multiple assembled days by ids", async () => {
    const resp1 = await backendService.createDay(10, 1, 2024, user.id);
    const resp2 = await backendService.createDay(11, 1, 2024, user.id);

    const day1 = resp1.data as DayDTO;
    const day2 = resp2.data as DayDTO;

    await backendService.addMultipleMealsToDay(day1.id, [recipe.id]);
    await backendService.addMultipleMealsToDay(day2.id, [otherRecipe.id]);

    const assembledResp = await backendService.getMultipleAssembledDaysByIds([
      day1.id,
      day2.id,
    ]);

    expect(assembledResp.status).toBe("success");
    expect(Array.isArray(assembledResp.data)).toBe(true);
    expect(assembledResp.data!.length).toBeGreaterThanOrEqual(2);
    expect(assembledResp.data![0]).toHaveProperty("meals");
  });
});
