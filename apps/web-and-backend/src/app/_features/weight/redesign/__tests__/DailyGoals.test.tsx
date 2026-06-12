import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DayDTO } from "shared";

import { getTodayDayId } from "@/app/_features/day/utils/getTodayDayId";
import { fromDayDTO } from "@/application-layer/dtos/DayDTO";

import { createAndPersistTest_Day_Recipes_Ingredients_User } from "../../../../../../tests/mocks/days";
// TODO (if needed) import an AppRepo
// TODO (if needed) import repo memory implementation

// const repo = AppsRepo as MemoryRepo;

import { TestDaysRepo } from "../../../../../../tests/repos/TestDaysRepo";
// TODO (if needed) import create mock functions
// import { createMockDayWithMeal } from '../../../../../tests/mocks/days';

import DailyGoals from "../DailyGoals";

async function setup() {
  const today = new Date();
  await createAndPersistTest_Day_Recipes_Ingredients_User(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear(),
  );

  const LoadedComponent = await DailyGoals({});

  render(LoadedComponent);

  const updateGoalsButton = screen.getByRole("button", {
    name: /actualizar objetivos/i,
  });

  return { updateGoalsButton };
}

afterEach(() => {
  TestDaysRepo.clearForTesting();
});

describe("DailyGoals", () => {
  it("should open the update goals form when the button is clicked", async () => {
    const { updateGoalsButton } = await setup();

    expect(
      screen.queryByRole("button", { name: /guardar/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(updateGoalsButton);

    expect(
      screen.getByRole("button", { name: /guardar/i }),
    ).toBeInTheDocument();
  });

  it("should show last calories value", async () => {
    const dayWithCalories = new Date(11, 11, 2000);

    const dayDTO: DayDTO =
      await createAndPersistTest_Day_Recipes_Ingredients_User(
        dayWithCalories.getDate(),
        dayWithCalories.getMonth() + 1,
        dayWithCalories.getFullYear(),
      );

    const day = fromDayDTO(dayDTO);
    day.updateCaloriesGoal(888);

    await TestDaysRepo.saveDay(day);

    await setup();

    const caloriesGoal = await screen.findByText(/888/i);

    expect(caloriesGoal).toBeInTheDocument();
  });

  describe("Side effects", () => {
    it("should update users calories goal in repo", async () => {
      const { updateGoalsButton } = await setup();

      await userEvent.click(updateGoalsButton);

      const caloriesInput = screen.getByRole("textbox", {
        name: /calorías/i,
      });

      await userEvent.type(caloriesInput, "999");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.updatedCaloriesGoal).toBe(999);
    });

    it("should update users calories goal in repo as integer if provided float", async () => {
      const { updateGoalsButton } = await setup();

      await userEvent.click(updateGoalsButton);

      const caloriesInput = screen.getByRole("textbox", {
        name: /calorías/i,
      });

      await userEvent.type(caloriesInput, "999,5");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.updatedCaloriesGoal).toBe(1000);
    });
  });
});
