import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockIngredients } from "@/../tests/mocks/ingredients";
import { IngredientDTO } from "@/application-layer/dtos/IngredientDTO";

import IngredientItemMini from "../IngredientItemMini";

const mockIngredients = await createMockIngredients();
const mockIngredient: IngredientDTO = mockIngredients[0];

async function setup(ingredient = mockIngredient, isSelected = false) {
  const onClick = vi.fn();

  render(
    <IngredientItemMini
      ingredient={ingredient}
      isSelected={isSelected}
      onClick={onClick}
    />,
  );

  return { onClick };
}

describe("IngredientItemMini", () => {
  it("should render the ingredient name", async () => {
    await setup();

    expect(screen.getByText(mockIngredient.name)).toBeInTheDocument();
  });

  it("should render calories rounded to integer", async () => {
    await setup();

    const expectedCalories = Math.round(
      mockIngredient.nutritionalInfoPer100g.calories,
    );

    expect(screen.getByText(`${expectedCalories} kcal`)).toBeInTheDocument();
  });

  it("should render protein rounded to integer", async () => {
    await setup();

    const expectedProtein = Math.round(
      mockIngredient.nutritionalInfoPer100g.protein,
    );

    expect(screen.getByText(`${expectedProtein}g prot`)).toBeInTheDocument();
  });

  it("should render the ingredient image", async () => {
    await setup();

    const img = screen.getByRole("img");

    expect(img).toBeInTheDocument();
  });

  it("should render fallback image when imageUrl is not provided", async () => {
    const ingredientWithoutImage: IngredientDTO = {
      ...mockIngredient,
      imageUrl: undefined,
    };

    await setup(ingredientWithoutImage);

    const img = screen.getByRole("img") as HTMLImageElement;

    expect(img.src).toContain("ingredient-no-picture");
  });

  it("should not show check icon when not selected", async () => {
    await setup(mockIngredient, false);

    // HiCheck renders as svg; when not selected there is no svg in the DOM
    const svgs = document.querySelectorAll("svg");

    expect(svgs.length).toBe(0);
  });

  it("should show check icon when isSelected is true", async () => {
    await setup(mockIngredient, true);

    // HiCheck renders as an svg inside the selected indicator
    const svgs = document.querySelectorAll("svg");

    expect(svgs.length).toBeGreaterThan(0);
  });

  it("should call onClick when the item is clicked", async () => {
    const { onClick } = await setup();

    await userEvent.click(screen.getByText(mockIngredient.name));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
