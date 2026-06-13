import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { fromDayDTO } from "@/application-layer/dtos/DayDTO";

import { createAndPersistTest_Day_Recipes_Ingredients_User } from "../../../../../../tests/mocks/days";
import { TestDaysRepo } from "../../../../../../tests/repos/TestDaysRepo";
import { TestMealsRepo } from "../../../../../../tests/repos/TestMealsRepo";
import dashboardPage from "../page";

// DashboardHeader contains async server-only components (UserSection) that
// cannot be rendered in the vitest/JSDOM environment.
vi.mock("@/app/_ui/screen/DashboardHeader", () => ({
  default: () => null,
}));

async function setup() {
  const today = new Date();
  const testDayDTO = await createAndPersistTest_Day_Recipes_Ingredients_User(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear(),
    {
      createWithMeal: true,
      returnAssembled: true,
    },
  );

  const day = fromDayDTO(testDayDTO);
  day.updateCaloriesGoal(1000);
  day.updateProteinGoal(200);
  day.updateUserWeightInKg(74.7);

  await TestDaysRepo.saveDay(day);

  const LoadedComponent = await dashboardPage();

  render(LoadedComponent);

  return { day };
}

afterEach(() => {
  TestDaysRepo.clearForTesting();
});

describe("dashboardPage", () => {
  it("should show last calories value", async () => {
    await setup();

    const caloriesGoal = await screen.findByText(/1000/i);

    expect(caloriesGoal).toBeInTheDocument();
  });

  it("should show last protein value", async () => {
    await setup();

    const proteinGoal = await screen.findByText(/200/i);

    expect(proteinGoal).toBeInTheDocument();
  });

  it("should show calories left to target goal", async () => {
    const { day } = await setup();

    const todayMeal = await TestMealsRepo.getMealById(day.mealIds[0]);

    const caloriesLeft = 1000 - todayMeal!.calories;

    const caloriesLeftElement = await screen.findByText(
      caloriesLeft.toString(),
    );

    expect(caloriesLeftElement).toBeInTheDocument();
  });

  it("should show protein left to target goal", async () => {
    const { day } = await setup();

    const todayMeal = await TestMealsRepo.getMealById(day.mealIds[0]);

    const proteinLeft = formatToInteger(200 - todayMeal!.protein);

    const proteinLeftElement = await screen.findByText(proteinLeft.toString());

    expect(proteinLeftElement).toBeInTheDocument();
  });

  it("should add recent meal to todays meals when clicking button", async () => {
    const { day } = await setup();

    const dayMealsCount = day.mealIds.length;

    const addButtons = await screen.findAllByRole("button", {
      name: /^añadir$/i,
    });

    const addButton = addButtons[0];

    expect(addButton).toBeInTheDocument();

    addButton.click();

    await waitFor(async () => {
      const updatedDay = await TestDaysRepo.getDayById(day.id);

      expect(updatedDay!.mealIds.length).toBe(dayMealsCount + 1);
    });
  });
});
