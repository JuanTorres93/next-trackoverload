import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createAndPersistTestDay } from "../../../../../tests/mocks/days";
import { TestDaysRepo } from "../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../tests/repos/TestFakeMealsRepo";
import FakeMeal from "../FakeMeal";

async function setup() {
  const day = await createAndPersistTestDay(1, 1, 2000, {
    fakeMeals: { name: "Test Fake Meal", calories: 400, protein: 25 },
    returnAssembled: true,
  });

  const fakeMeal = day.fakeMeals[0];

  render(<FakeMeal dayId={day.id} fakeMeal={fakeMeal} />);

  return { fakeMeal, day };
}

describe("FakeMeal", () => {
  afterEach(() => {
    TestDaysRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
  });

  it("should render fake meal name", async () => {
    const { fakeMeal } = await setup();

    const fakeMealName = await screen.findByText(fakeMeal.name);

    expect(fakeMealName).toBeInTheDocument();
  });

  it("should render fake meal calories", async () => {
    const { fakeMeal } = await setup();

    const caloriesElement = screen.getByText(
      new RegExp(fakeMeal.calories.toString(), "i"),
    );

    expect(caloriesElement).toBeInTheDocument();
  });

  it("should render fake meal protein", async () => {
    const { fakeMeal } = await setup();

    const proteinElement = screen.getByText(
      new RegExp(fakeMeal.protein.toString(), "i"),
    );

    expect(proteinElement).toBeInTheDocument();
  });

  it("should remove fake meal from day on delete button click", async () => {
    const { day } = await setup();

    const dayInRepo = await TestDaysRepo.getDayById(day.id);
    expect(dayInRepo!.fakeMealIds).toHaveLength(1);

    const deleteButton = screen.getByTestId("remove-fake-meal");

    userEvent.click(deleteButton);

    await waitFor(async () => {
      const dayInRepoAfter = await TestDaysRepo.getDayById(day.id);

      expect(dayInRepoAfter!.fakeMealIds).toHaveLength(0);
    });
  });

  it("should remove fake meal from repo on delete button click", async () => {
    const { fakeMeal } = await setup();

    const fakeMealInRepo = await TestFakeMealsRepo.getFakeMealById(fakeMeal.id);
    expect(fakeMealInRepo).not.toBeNull();

    const deleteButton = screen.getByTestId("remove-fake-meal");

    act(() => {
      deleteButton.click();
    });

    await waitFor(async () => {
      const fakeMealInRepoAfter = await TestFakeMealsRepo.getFakeMealById(
        fakeMeal.id,
      );

      expect(fakeMealInRepoAfter).toBeNull();
    });
  });
});
