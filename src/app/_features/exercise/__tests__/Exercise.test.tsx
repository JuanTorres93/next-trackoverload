import { render, screen } from "@testing-library/react";

import { createMockExercises } from "@/../tests/mocks/exercises";
import { ExerciseDTO } from "@/application-layer/dtos/ExerciseDTO";

import Exercise from "../Exercise";

const mockExercises = await createMockExercises();
const mockExercise: ExerciseDTO = mockExercises[0];

function setup(exercise = mockExercise) {
  render(<Exercise exercise={exercise} />);
}

describe("Exercise", () => {
  it("should render the exercise name", () => {
    setup();

    expect(screen.getByText(mockExercise.name)).toBeInTheDocument();
  });
});
