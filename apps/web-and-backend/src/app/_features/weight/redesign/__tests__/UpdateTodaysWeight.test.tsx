import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createAndPersistTest_Day_Recipes_Ingredients_User } from "@/../tests/mocks/days";
import "@/../tests/mocks/nextjs";
import { TestDaysRepo } from "@/../tests/repos/TestDaysRepo";
import { getTodayDayId } from "@/app/_features/day/utils/getTodayDayId";

import UpdateTodaysWeight from "../UpdateTodaysWeight";

async function setup() {
  const today = new Date();
  await createAndPersistTest_Day_Recipes_Ingredients_User(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear(),
  );

  const LoadedComponent = await UpdateTodaysWeight({});
  render(LoadedComponent);

  const updateWeightButton = screen.getByRole("button", {
    name: /actualizar peso/i,
  });

  return { updateWeightButton };
}

afterEach(() => {
  TestDaysRepo.clearForTesting();
});

describe("UpdateTodaysWeight", () => {
  it("should show the update weight form when clicking the button", async () => {
    const { updateWeightButton } = await setup();

    expect(
      screen.queryByRole("button", { name: /guardar/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(updateWeightButton);

    expect(
      screen.getByRole("button", { name: /guardar/i }),
    ).toBeInTheDocument();
  });

  describe("Side effects", () => {
    it("should update users weight in repo", async () => {
      const { updateWeightButton } = await setup();

      await userEvent.click(updateWeightButton);

      const weightInput = screen.getByPlaceholderText(/introduce tu peso/i);

      await userEvent.type(weightInput, "80.5");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.userWeightInKg).toBe(80.5);
    });

    it("should update users weight in repo using comma as decimal separator", async () => {
      const { updateWeightButton } = await setup();

      await userEvent.click(updateWeightButton);

      const weightInput = screen.getByPlaceholderText(/introduce tu peso/i);

      await userEvent.type(weightInput, "80,9");

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(saveButton);

      const todayId = getTodayDayId();

      const updatedDay = await TestDaysRepo.getDayById(todayId);

      expect(updatedDay!.userWeightInKg).toBe(80.9);
    });
  });
});
