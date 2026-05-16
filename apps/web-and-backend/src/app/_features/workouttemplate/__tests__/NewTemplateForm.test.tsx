import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockExercises } from "../../../../../tests/mocks/exercises";
import { TEST_USER_ID } from "../../../../../tests/mocks/nextjs";
import { MemoryExercisesRepo } from "../../../../infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "../../../../interface-adapters/app/repos/AppExercisesRepo";
import NewTemplateForm from "../NewTemplateForm";

const repo = AppExercisesRepo as MemoryExercisesRepo;

async function setup() {
  const mockExercises = await createMockExercises();

  render(<NewTemplateForm />);

  const exerciseSearchInput = await screen.findByTestId(
    "exercise-search-input",
  );

  return { exerciseSearchInput, mockExercises };
}

describe("NewTemplateForm", () => {
  afterEach(() => {
    repo.clearForTesting();
  });

  it("should render exercise search input", async () => {
    const { exerciseSearchInput } = await setup();

    expect(exerciseSearchInput).toBeInTheDocument();
  });

  it("should not render found exercises list by default", async () => {
    await setup();

    const foundExercisesList = screen.queryByTestId("exercise-list");

    expect(foundExercisesList).not.toBeInTheDocument();
  });

  it("should not render selected exercises list by default", async () => {
    await setup();

    const selectedExercisesList = screen.queryByTestId(
      "selected-exercise-list",
    );

    expect(selectedExercisesList).not.toBeInTheDocument();
  });

  it("should show found exercises list when user types in search input", async () => {
    const { exerciseSearchInput, mockExercises } = await setup();

    await userEvent.type(exerciseSearchInput, mockExercises[0].name);

    waitFor(async () => {
      const foundExercisesList = await screen.findByTestId("exercise-list");

      expect(foundExercisesList).toBeInTheDocument();
    });
  });

  it("should show selected exercises list when user selects an exercise", async () => {
    const { exerciseSearchInput, mockExercises } = await setup();

    await userEvent.type(exerciseSearchInput, mockExercises[0].name);

    waitFor(async () => {
      const foundExercisesList = await screen.findByTestId("exercise-list");

      expect(foundExercisesList).toBeInTheDocument();
    });

    waitFor(async () => {
      const exerciseItem = await screen.findByText(mockExercises[0].name);

      expect(exerciseItem).toBeInTheDocument();

      await userEvent.click(exerciseItem);

      const selectedExercisesList = await screen.findByTestId(
        "selected-exercise-list",
      );

      expect(selectedExercisesList).toBeInTheDocument();
    });
  });
});
