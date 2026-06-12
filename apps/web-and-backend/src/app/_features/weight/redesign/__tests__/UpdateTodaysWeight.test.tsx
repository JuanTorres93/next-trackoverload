import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createAndPersistTest_Day_Recipes_Ingredients_User } from "@/../tests/mocks/days";
import "@/../tests/mocks/nextjs";
import { TestDaysRepo } from "@/../tests/repos/TestDaysRepo";

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
});
