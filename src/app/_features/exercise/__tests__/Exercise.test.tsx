import { render, screen } from "@testing-library/react";

import { createMockExercises } from "@/../tests/mocks/exercises";
import { ExerciseDTO } from "@/application-layer/dtos/ExerciseDTO";

import Exercise from "../Exercise";

const mockExercises = await createMockExercises();
const mockExercise: ExerciseDTO = mockExercises[0];

function renderExercise(isSelected = false) {
  const { container } = render(
    <Exercise exercise={mockExercise} isSelected={isSelected} />,
  );

  return container.firstChild as HTMLElement;
}

describe("Exercise", () => {
  it("should render the exercise name", () => {
    renderExercise();

    expect(screen.getByText(mockExercise.name)).toBeInTheDocument();
  });

  it("should have different styles when selected vs unselected", () => {
    const unselectedElement = renderExercise(false);
    const selectedElement = renderExercise(true);

    expect(selectedElement.className).not.toBe(unselectedElement.className);
  });
});
