import { render, screen } from "@testing-library/react";

import { validFakeMealProps } from "../../../../tests/createProps/fakeMealTestProps";
import { mockDayApiFetch } from "../../../../tests/mocks/dayApi";
import { createAndPersistTest_Day_Recipes_Ingredients_User } from "../../../../tests/mocks/days";
import { createAndPersistTestUser } from "../../../../tests/mocks/user";
import { TestDaysRepo } from "../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../tests/repos/TestFakeMealsRepo";
import { TestMealsRepo } from "../../../../tests/repos/TestMealsRepo";
import { dateToDayId } from "../../../domain/value-objects/DayId/DayId";
import DashboardPage from "../page";

async function setup() {
  await createAndPersistTestUser();
  mockDayApiFetch();

  const todayId = dateToDayId(new Date());
  const dayWithMeals = await createAndPersistTest_Day_Recipes_Ingredients_User(
    todayId.day,
    todayId.month,
    todayId.year,
    {
      returnAssembled: true,
      createWithMeal: true,
      fakeMeals: validFakeMealProps,
    },
  );

  render(<DashboardPage />);

  const weightInput = await screen.findByTestId("input-weight");

  return { weightInput, dayWithMeals, todayId };
}

describe("DashboardPage", () => {
  afterEach(() => {
    TestMealsRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestDaysRepo.clearForTesting();
    vi.restoreAllMocks();
  });

  describe("Today's meals", async () => {
    it("Renders meal names for the day", async () => {
      const { dayWithMeals } = await setup();
      const meal = dayWithMeals.meals[0];

      const mealNameElement = screen.getByText(meal.name);

      expect(mealNameElement).toBeInTheDocument();
    });

    it("Renders fake meals for the day", async () => {
      const { dayWithMeals } = await setup();

      const fakeMeal = dayWithMeals.fakeMeals[0];

      const fakeMealNameElement = screen.getByText(fakeMeal.name);

      expect(fakeMealNameElement).toBeInTheDocument();
    });
  });

  describe("WeightAnalisys", () => {
    it("Renders input for changing weight", async () => {
      // Actual behaviour is tested in the component itself
      const { weightInput } = await setup();

      expect(weightInput).toBeInTheDocument();
    });

    it("Renders calories goal input for today", async () => {
      await setup();

      const caloriesGoalInput = screen.getByTestId("input-calories-goal");

      expect(caloriesGoalInput).toBeInTheDocument();
    });
  });
});
