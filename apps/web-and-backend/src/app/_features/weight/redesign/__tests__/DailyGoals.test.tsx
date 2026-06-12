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
  const testDayDTO = await createAndPersistTest_Day_Recipes_Ingredients_User(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear(),
  );

  const LoadedComponent = await DailyGoals({});

  render(LoadedComponent);

  const updateGoalsButton = screen.getByRole("button", {
    name: /actualizar objetivos/i,
  });

  return { updateGoalsButton, testDayDTO };
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

  it("should show last protein value", async () => {
    const dayWithProtein = new Date(12, 12, 2000);

    const dayDTO: DayDTO =
      await createAndPersistTest_Day_Recipes_Ingredients_User(
        dayWithProtein.getDate(),
        dayWithProtein.getMonth() + 1,
        dayWithProtein.getFullYear(),
      );

    const day = fromDayDTO(dayDTO);
    day.updateProteinGoal(77);

    await TestDaysRepo.saveDay(day);

    await setup();

    const proteinGoal = await screen.findByText(/77/i);

    expect(proteinGoal).toBeInTheDocument();
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

    it("should update users protein goal in repo", async () => {
      const { updateGoalsButton } = await setup();

      await userEvent.click(updateGoalsButton);

      const proteinInput = screen.getByRole("textbox", {
        name: /proteínas/i,
      });

      await userEvent.type(proteinInput, "180");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.updatedProteinGoal).toBe(180);
    });

    it("should not affect protein if only updating calories", async () => {
      const { updateGoalsButton, testDayDTO } = await setup();

      const day = fromDayDTO(testDayDTO);
      day.updateProteinGoal(30);

      await TestDaysRepo.saveDay(day);

      await userEvent.click(updateGoalsButton);

      const caloriesInput = screen.getByRole("textbox", {
        name: /calorías/i,
      });

      await userEvent.type(caloriesInput, "999");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.updatedProteinGoal).toBe(30);
    });

    it("should not affect calories if only updating protein", async () => {
      const { updateGoalsButton, testDayDTO } = await setup();

      const day = fromDayDTO(testDayDTO);
      day.updateCaloriesGoal(3000);

      await TestDaysRepo.saveDay(day);

      await userEvent.click(updateGoalsButton);

      const proteinInput = screen.getByRole("textbox", {
        name: /proteínas/i,
      });

      await userEvent.type(proteinInput, "180");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.updatedCaloriesGoal).toBe(3000);
    });
  });
});
