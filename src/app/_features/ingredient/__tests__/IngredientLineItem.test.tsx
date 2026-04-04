import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngredientLineDTO } from "@/application-layer/dtos/IngredientLineDTO";

import { createMockDay } from "../../../../../tests/mocks/days";
import IngredientLineItem from "../IngredientLineItem";

const mockDay = await createMockDay(1, 1, 2000, {
  createWithMeal: true,
  returnAssembled: true,
});
const mockIngredientLine: IngredientLineDTO =
  mockDay.meals[0].ingredientLines[0];

const DELETE_BUTTON_TEST_ID = "nutritional-summary-delete-button";

async function setup(ingredientLine = mockIngredientLine) {
  const onQuantityChange = vi.fn();
  const onRemove = vi.fn().mockResolvedValue(undefined);

  render(
    <IngredientLineItem
      ingredientLine={ingredientLine}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
    />,
  );

  const deleteButton = screen.getByTestId(DELETE_BUTTON_TEST_ID);

  return { deleteButton, onQuantityChange, onRemove };
}

describe("IngredientLineItem", () => {
  it("should render ingredient name", async () => {
    await setup();

    expect(
      screen.getByText(mockIngredientLine.ingredient.name),
    ).toBeInTheDocument();
  });

  it("should render calories rounded to integer", async () => {
    await setup();

    expect(
      screen.getByText(Math.round(mockIngredientLine.calories).toString()),
    ).toBeInTheDocument();
  });

  it("should render protein rounded to integer", async () => {
    await setup();

    expect(
      screen.getByText(Math.round(mockIngredientLine.protein).toString()),
    ).toBeInTheDocument();
  });

  it("should render ingredient image with correct src", async () => {
    await setup();

    const img = screen.getByRole("img") as HTMLImageElement;

    expect(img.alt).toBe(mockIngredientLine.ingredient.name);
  });

  it("should render fallback image when imageUrl is not provided", async () => {
    const lineWithoutImage: IngredientLineDTO = {
      ...mockIngredientLine,
      ingredient: { ...mockIngredientLine.ingredient, imageUrl: undefined },
    };

    await setup(lineWithoutImage);

    const img = screen.getByRole("img") as HTMLImageElement;

    expect(img.src).toContain("ingredient-no-picture");
  });

  it("should render quantity input with correct default value", async () => {
    await setup();

    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(Number(input.value)).toBe(mockIngredientLine.quantityInGrams);
  });

  it("should call onQuantityChange with the new value when input changes", async () => {
    const { onQuantityChange } = await setup();

    const input = screen.getByRole("spinbutton");

    await userEvent.clear(input);
    await userEvent.type(input, "150");

    expect(onQuantityChange).toHaveBeenCalledWith(150);
  });

  it("should call onRemove when delete button is clicked", async () => {
    const { deleteButton, onRemove } = await setup();

    await userEvent.click(deleteButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("should disable input and delete button while removing", async () => {
    let resolveRemove!: () => void;
    const onRemove = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRemove = resolve;
        }),
    );
    const onQuantityChange = vi.fn();

    render(
      <IngredientLineItem
        ingredientLine={mockIngredientLine}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    const deleteButton = screen.getByTestId(DELETE_BUTTON_TEST_ID);
    const input = screen.getByRole("spinbutton");

    await userEvent.click(deleteButton);

    expect(input).toBeDisabled();
    expect(deleteButton).toBeDisabled();

    resolveRemove();

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });
});
