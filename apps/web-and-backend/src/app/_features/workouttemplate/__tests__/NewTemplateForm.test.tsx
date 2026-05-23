import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockExerciseApiFetch } from "../../../../../tests/mocks/exerciseApi";
import { createMockExercises } from "../../../../../tests/mocks/exercises";
import { TEST_USER_ID } from "../../../../../tests/mocks/nextjs";
import { createMockUser } from "../../../../../tests/mocks/user";
import { MemoryExercisesRepo } from "../../../../infra/repos/memory/MemoryExercisesRepo";
import { MemoryWorkoutTemplatesRepo } from "../../../../infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { AppExercisesRepo } from "../../../../interface-adapters/app/repos/AppExercisesRepo";
import { AppWorkoutsTemplatesRepo } from "../../../../interface-adapters/app/repos/AppWorkoutsTemplatesRepo";
import NewTemplateForm from "../NewTemplateForm";

await createMockUser();

const exercisesRepo = AppExercisesRepo as MemoryExercisesRepo;
const templatesRepo = AppWorkoutsTemplatesRepo as MemoryWorkoutTemplatesRepo;

async function setup() {
  const mockExercises = await createMockExercises();

  render(<NewTemplateForm />);

  const exerciseSearchInput = await screen.findByTestId(
    "exercise-search-input",
  );

  const templateNameInput = await screen.findByTestId("template-name-input");

  const createTemplateButton = await screen.findByTestId(
    "create-template-button",
  );

  return {
    exerciseSearchInput,
    templateNameInput,
    createTemplateButton,
    mockExercises,
  };
}

describe("NewTemplateForm", () => {
  beforeEach(() => {
    mockExerciseApiFetch();
  });

  afterEach(() => {
    exercisesRepo.clearForTesting();
    templatesRepo.clearForTesting();
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

    await waitFor(async () => {
      const foundExercisesList = await screen.findByTestId("exercise-list");

      expect(foundExercisesList).toBeInTheDocument();
    });
  });

  it("should show selected exercises list when user selects an exercise", async () => {
    const { exerciseSearchInput, mockExercises } = await setup();

    await userEvent.type(exerciseSearchInput, mockExercises[0].name);

    await waitFor(async () => {
      const foundExercisesList = await screen.findByTestId("exercise-list");

      expect(foundExercisesList).toBeInTheDocument();
    });

    await waitFor(async () => {
      const exerciseItem = await screen.findByText(mockExercises[0].name);

      expect(exerciseItem).toBeInTheDocument();

      await userEvent.click(exerciseItem);

      const selectedExercisesList = await screen.findByTestId(
        "selected-exercise-list",
      );

      expect(selectedExercisesList).toBeInTheDocument();
    });
  });

  describe("Creation", () => {
    it("should create template with correct name and exercises", async () => {
      const {
        exerciseSearchInput,
        templateNameInput,
        createTemplateButton,
        mockExercises,
      } = await setup();

      const templateName = "My New Template";

      await userEvent.type(templateNameInput, templateName);

      await userEvent.type(exerciseSearchInput, mockExercises[0].name);

      await waitFor(async () => {
        const exerciseItem = await screen.findByText(mockExercises[0].name);

        expect(exerciseItem).toBeInTheDocument();

        await userEvent.click(exerciseItem);
      });

      await userEvent.click(createTemplateButton);

      await waitFor(async () => {
        const createdTemplates =
          await templatesRepo.getAllWorkoutTemplatesByUserId(TEST_USER_ID);

        expect(createdTemplates.length).toBe(1);
        expect(createdTemplates[0].name).toBe(templateName);
        expect(createdTemplates[0].exercises.length).toBe(1);
      });
    });
  });
});
