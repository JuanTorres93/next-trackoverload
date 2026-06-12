import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { addMealsToDay } from "@/app/_features/day/actions";
import { fromDayDTO } from "@/application-layer/dtos/DayDTO";

import { createAndPersistTest_Day_Recipes_Ingredients_User } from "../../../../../../tests/mocks/days";
import { TestDaysRepo } from "../../../../../../tests/repos/TestDaysRepo";
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
  );

  const day = fromDayDTO(testDayDTO);
  day.updateCaloriesGoal(1000);
  day.updateProteinGoal(200);

  await TestDaysRepo.saveDay(day);

  // await addMealsToDay(day.id, [day.recipesIds[0]]);

  const LoadedComponent = await dashboardPage();

  render(LoadedComponent);
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
});
