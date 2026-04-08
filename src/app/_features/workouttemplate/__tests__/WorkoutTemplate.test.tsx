import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockWorkoutTemplates } from "@/../tests/mocks/workoutTemplates";

import WorkoutTemplate from "../WorkoutTemplate";

const { mockTemplate } = await createMockWorkoutTemplates();

function setup() {
  render(<WorkoutTemplate workoutTemplate={mockTemplate} />);

  const startWorkoutButton = screen.getByTestId("start-workout-button");

  return {
    startWorkoutButton,
  };
}

describe("WorkoutTemplate", () => {
  it("should render the template name", () => {
    setup();

    expect(screen.getByText(mockTemplate.name)).toBeInTheDocument();
  });

  it("should render the exercise count", () => {
    setup();

    expect(
      screen.getByText(`${mockTemplate.exercises.length} ejercicios`),
    ).toBeInTheDocument();
  });

  it("should render the total sets", () => {
    setup();

    const totalSets = mockTemplate.exercises.reduce(
      (sum, e) => sum + e.sets,
      0,
    );
    expect(screen.getByText(`${totalSets} series`)).toBeInTheDocument();
  });

  it("should render a link to the template detail page", () => {
    setup();

    const link = screen.getByRole("link") as HTMLAnchorElement;

    expect(link).toBeInTheDocument();
    expect(link.href).toMatch(new RegExp(`/app/templates/${mockTemplate.id}`));
  });

  it("should call onStartWorkout when the start button is clicked", async () => {
    const user = userEvent.setup();
    const { startWorkoutButton } = setup();

    await user.click(startWorkoutButton);

    const spinner = await screen.findByTestId("start-workout-spinner");
    expect(spinner).toBeInTheDocument();
  });
});
