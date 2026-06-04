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
});
