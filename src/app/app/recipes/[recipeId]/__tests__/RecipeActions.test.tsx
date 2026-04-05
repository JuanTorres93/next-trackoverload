import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockIngredientApiFetch } from "@/../tests/mocks/ingredientApi";
import { createMockIngredients } from "@/../tests/mocks/ingredients";
import { createMockRecipes } from "@/../tests/mocks/recipes";
import { SCAN_WINDOW_SIZE } from "@/app/_features/ingredient/ZXingBarcodeScanner";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import { mockDecodeFromConstraints } from "../../../../../../tests/mocks/zxing";
import RecipeActions from "../RecipeActions";

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let recipe: RecipeDTO;

await createMockIngredients();
mockIngredientApiFetch();

async function setup() {
  const { mockRecipes } = await createMockRecipes();
  recipe = mockRecipes[0];

  render(<RecipeActions recipe={recipe} />);

  return { recipe };
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe("RecipeActions", () => {
  describe("Shown info", () => {
    it("renders ingredient lines", async () => {
      await setup();

      for (const line of recipe.ingredientLines) {
        expect(screen.getByText(line.ingredient.name)).toBeInTheDocument();
      }
    });

    it("renders ingredient quantities", async () => {
      await setup();

      for (const line of recipe.ingredientLines) {
        const quantityElement = screen.getByDisplayValue(
          `${line.quantityInGrams}`,
        );
        expect(quantityElement).toBeInTheDocument();
      }
    });

    it("renders total rounded calories per ingredient", async () => {
      await setup();

      for (const line of recipe.ingredientLines) {
        const roundedCalories = Math.round(line.calories).toString();
        expect(screen.getByText(roundedCalories)).toBeInTheDocument();
      }
    });

    it("renders total rounded protein per ingredient", async () => {
      await setup();

      for (const line of recipe.ingredientLines) {
        const roundedProtein = Math.round(line.protein).toString();
        expect(screen.getByText(roundedProtein)).toBeInTheDocument();
      }
    });
  });

  describe("Behavior", () => {
    it("allows updating ingredient quantity", async () => {
      await setup();

      const lineToUpdate = recipe.ingredientLines[0];
      const newQuantity = "500";

      const quantityInput = screen.getByDisplayValue(
        lineToUpdate.quantityInGrams.toString(),
      );

      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, newQuantity);

      expect(quantityInput).toHaveValue("500");

      await waitFor(async () => {
        const updatedIngredientLine = await recipesRepo
          .getRecipeById(recipe.id)
          .then((r) =>
            r?.ingredientLines.find(
              (line) => line.ingredient.id === lineToUpdate.ingredient.id,
            ),
          );

        expect(updatedIngredientLine?.quantityInGrams).toBe(
          parseInt(newQuantity),
        );
      });
    });

    it("fetches ingredients through barcode", async () => {
      mockDecodeFromConstraints.mockImplementation(
        (
          _constraints: unknown,
          _videoEl: unknown,
          callback: (
            result: { getText: () => string } | null,
            err: null,
          ) => void,
        ) => {
          for (let i = 0; i < SCAN_WINDOW_SIZE; i++) {
            callback({ getText: () => "8414807558305" }, null);
          }
        },
      );

      await setup();

      const addIngredientButton = screen.getByTestId(
        "add-ingredient-modal-button",
      );
      await userEvent.click(addIngredientButton);

      const barcodeScannerButton = await screen.findByTestId(
        "open-scanner-button",
      );
      await userEvent.click(barcodeScannerButton);

      await waitFor(async () => {
        const ingredientList = await screen.findByTestId("ingredient-list");
        expect(ingredientList.children.length).toBe(1);
      });

      const ingredientElement = screen.getByText(/avena/i);
      expect(ingredientElement).toBeInTheDocument();
    });

    it("duplicates recipe", async () => {
      await setup();

      const initialRecipes = recipesRepo.countForTesting();

      const duplicateButton = screen.getByTestId("duplicate-recipe-button");

      await userEvent.click(duplicateButton);

      await waitFor(() => {
        const allRecipes = recipesRepo.countForTesting();
        expect(allRecipes).toBe(initialRecipes + 1);
      });
    });

    it("deletes recipe", async () => {
      await setup();

      const initialRecipes = recipesRepo.countForTesting();

      const deleteButton = screen.getByTestId("delete-recipe-button");
      await userEvent.click(deleteButton);

      const confirmButton = await screen.findByRole("button", {
        name: "Eliminar",
      });
      await userEvent.click(confirmButton);

      await waitFor(() => {
        const allRecipes = recipesRepo.countForTesting();
        expect(allRecipes).toBe(initialRecipes - 1);
      });
    });

    it("can remove ingredients from recipe", async () => {
      await setup();

      const initialIngredientLinesCount = recipe.ingredientLines.length;

      const ingredientLinesContainer = screen.getByTestId(
        "ingredient-lines-container",
      );

      const ingredientLineElement = ingredientLinesContainer
        .children[0] as HTMLElement;
      const removeButton = within(ingredientLineElement).getByTestId(
        "nutritional-summary-delete-button",
      );

      await userEvent.click(removeButton);

      await waitFor(async () => {
        const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);
        expect(updatedRecipe).not.toBeNull();
        expect(updatedRecipe!.ingredientLines.length).toBe(
          initialIngredientLinesCount - 1,
        );
      });
    });

    it("cannot leave a recipe with less than one ingredient", async () => {
      await setup();

      const deleteIngredientButtons = await screen.findAllByTestId(
        "nutritional-summary-delete-button",
      );

      const [lastButton, ...restButtons] = deleteIngredientButtons;

      for (const button of restButtons) {
        await userEvent.click(button);
      }

      const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);
      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.ingredientLines.length).toBe(1);

      await userEvent.click(lastButton);

      const finalRecipe = await recipesRepo.getRecipeById(recipe.id);
      expect(finalRecipe).not.toBeNull();
      expect(finalRecipe!.ingredientLines.length).toBe(1);
    });

    it("can add new ingredient to recipe", async () => {
      await setup();

      const existingLinesContainer = screen.getByTestId(
        "ingredient-lines-container",
      );
      const initialIngredientLinesCount =
        existingLinesContainer.childElementCount;

      const addIngredientButton = screen.getByTestId(
        "add-ingredient-modal-button",
      );
      await userEvent.click(addIngredientButton);

      const searchIngredientInput = await screen.findByPlaceholderText(
        "Buscar ingredientes...",
      );
      const searchButton = screen.getByRole("button", { name: "Buscar" });

      await userEvent.type(searchIngredientInput, "celery");
      await userEvent.click(searchButton);

      const ingredientList = await screen.findByTestId("ingredient-list");
      await waitFor(() => {
        expect(ingredientList.childNodes.length).toBeGreaterThan(0);
      });

      const searchResultItem = await screen.findByText(/celery/i);
      await userEvent.click(searchResultItem);

      const addButton = screen.getByRole("button", { name: /^añadir$/i });
      await userEvent.click(addButton);

      await waitFor(() => {
        recipesRepo.getRecipeById(recipe.id).then((updatedRecipe) => {
          expect(updatedRecipe).not.toBeNull();
          expect(updatedRecipe!.ingredientLines.length).toBe(
            initialIngredientLinesCount + 1,
          );
        });
      });
    });
  });
});
