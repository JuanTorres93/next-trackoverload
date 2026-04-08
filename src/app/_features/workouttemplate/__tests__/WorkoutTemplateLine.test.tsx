import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockWorkoutTemplates } from "@/../tests/mocks/workoutTemplates";
import { WorkoutTemplateLineDTO } from "@/application-layer/dtos/WorkoutTemplateLineDTO";

import WorkoutTemplateLine from "../WorkoutTemplateLine";

const { mockTemplate, exercisesForTemplates } =
  await createMockWorkoutTemplates();
const mockLine: WorkoutTemplateLineDTO = mockTemplate.exercises[0];
const mockExerciseName = exercisesForTemplates[0].name;

function setup(
  line = mockLine,
  exerciseName = mockExerciseName,
  {
    onSetsChange,
    onRemove,
  }: {
    onSetsChange?: () => void;
    onRemove?: () => void;
  } = {},
) {
  render(
    <WorkoutTemplateLine
      workoutTemplateLine={line}
      exerciseName={exerciseName}
      onSetsChange={onSetsChange}
      onRemove={onRemove}
    />,
  );
}

describe("WorkoutTemplateLine", () => {
  it("should render the exercise name", () => {
    setup();

    expect(screen.getByText(mockExerciseName)).toBeInTheDocument();
  });

  it("should render the sets count", () => {
    setup();

    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(Number(input.value)).toBe(mockLine.sets);
  });

  it("should call onSetsChange when the sets input changes", async () => {
    const onSetsChange = vi.fn();
    setup(mockLine, mockExerciseName, { onSetsChange });

    const input = screen.getByRole("spinbutton");
    await userEvent.clear(input);
    await userEvent.type(input, "5");

    expect(onSetsChange).toHaveBeenCalled();
  });

  it("should render the remove button when onRemove is provided", () => {
    const onRemove = vi.fn();
    setup(mockLine, mockExerciseName, { onRemove });

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should not render the remove button when onRemove is not provided", () => {
    setup();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call onRemove when the remove button is clicked", async () => {
    const onRemove = vi.fn().mockResolvedValue(undefined);
    setup(mockLine, mockExerciseName, { onRemove });

    await userEvent.click(screen.getByRole("button"));

    expect(onRemove).toHaveBeenCalledOnce();
  });
});
