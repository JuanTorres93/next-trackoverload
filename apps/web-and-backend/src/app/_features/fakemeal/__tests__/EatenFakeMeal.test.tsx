import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockDay } from "../../../../../tests/mocks/days";
import { TEST_USER_ID } from "../../../../../tests/mocks/nextjs";
import { TestDaysRepo } from "../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../tests/repos/TestFakeMealsRepo";
import { TestMealsRepo } from "../../../../../tests/repos/TestMealsRepo";
import EatenFakeMeal from "../EatenFakeMeal";

async function setup() {
  const dayWithFakeMeal = await createMockDay(1, 1, 2000, {
    returnAssembled: true,
    fakeMeals: { name: "Test Fake Meal", calories: 400, protein: 25 },
  });
  const fakeMeal = dayWithFakeMeal.fakeMeals[0];

  render(<EatenFakeMeal fakeMeal={fakeMeal} dayId={dayWithFakeMeal.id} />);

  return { fakeMeal, dayId: dayWithFakeMeal.id };
}

describe("EatenFakeMeal", () => {
  afterEach(() => {
    TestDaysRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestMealsRepo.clearForTesting();
  });

  it("should delete fake meal when clicking delete button", async () => {
    const { fakeMeal } = await setup();

    const deleteButton = screen.getByTestId("delete-food-button");

    await userEvent.click(deleteButton);

    await waitFor(async () => {
      const savedFakeMeal = await TestFakeMealsRepo.getFakeMealByIdAndUserId(
        fakeMeal.id,
        TEST_USER_ID,
      );

      expect(savedFakeMeal).toBeNull();
    });
  });
});
