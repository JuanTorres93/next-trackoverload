import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TEST_USER_ID } from "@/../tests/mocks/nextjs";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "@/infra/repos/memory/MemoryFakeMealsRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "@/interface-adapters/app/repos/AppFakeMealsRepo";

import { createEmptyTestDay } from "../../../../../tests/createProps/dayTestProps";
import { mockIngredientApiFetch } from "../../../../../tests/mocks/ingredientApi";
import { createMockUser } from "../../../../../tests/mocks/user";
import { mockDecodeFromConstraints } from "../../../../../tests/mocks/zxing";
import { SCAN_WINDOW_SIZE } from "../../ingredient/ZXingBarcodeScanner";
import AddFakeMealForm from "../AddFakeMealForm";

const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

await createMockUser();

const MOCK_BARCODE = "8480000543745";
const MOCK_INGREDIENT_NAME = "Leche Entera";
const MOCK_CALORIES_PER_100G = 66;
const MOCK_PROTEIN_PER_100G = 3;

mockIngredientApiFetch({
  barcodeIngredient: {
    ingredient: {
      name: MOCK_INGREDIENT_NAME,
      nutritionalInfoPer100g: {
        calories: MOCK_CALORIES_PER_100G,
        protein: MOCK_PROTEIN_PER_100G,
      },
      imageUrl: undefined,
    },
    externalRef: {
      externalId: MOCK_BARCODE,
      source: "openfoodfacts",
    },
  },
});

async function setup() {
  daysRepo.clearForTesting();
  fakeMealsRepo.clearForTesting();

  const day = createEmptyTestDay({
    userId: TEST_USER_ID,
  });
  await daysRepo.saveDay(day);

  render(<AddFakeMealForm dayId={day.id} />);

  const nameInput = screen.getByLabelText(/nombre de la comida/i);
  const caloriesInput = screen.getByLabelText(/calorías/i);
  const proteinsInput = screen.getByLabelText(/proteínas/i);
  const submitButton = screen.getByRole("button", { name: /añadir comida/i });
  const barcodeScannerButton = screen.getByTestId("open-scanner-button");

  return {
    nameInput,
    caloriesInput,
    proteinsInput,
    submitButton,
    barcodeScannerButton,
    dayId: day.id,
  };
}

function simulateBarcodeScan(barcode: string) {
  mockDecodeFromConstraints.mockImplementation(
    (
      _constraints: unknown,
      _videoEl: unknown,
      callback: (result: { getText: () => string } | null, err: null) => void,
    ) => {
      for (let i = 0; i < SCAN_WINDOW_SIZE; i++) {
        callback({ getText: () => barcode }, null);
      }
    },
  );
}

describe("AddFakeMealForm", () => {
  it("does not show quantity field before scanning", async () => {
    await setup();

    expect(screen.queryByLabelText(/cantidad/i)).not.toBeInTheDocument();
  });

  it("creates fake meal on submit", async () => {
    const { nameInput, caloriesInput, proteinsInput, submitButton } =
      await setup();

    await userEvent.type(nameInput, "Fake Meal Test");
    await userEvent.type(caloriesInput, "500");
    await userEvent.type(proteinsInput, "30");
    await userEvent.click(submitButton);

    await waitFor(async () => {
      const createdFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      const createdFakeMeal = createdFakeMeals[0];

      expect(createdFakeMeal).toBeDefined();
      expect(createdFakeMeal?.calories).toBe(500);
      expect(createdFakeMeal?.protein).toBe(30);
    });
  });

  it("fills name, calories and proteins after barcode scan", async () => {
    simulateBarcodeScan(MOCK_BARCODE);

    const { barcodeScannerButton, nameInput, caloriesInput, proteinsInput } =
      await setup();

    await userEvent.click(barcodeScannerButton);

    // Default quantity is 100g so values should equal the per-100g values
    await waitFor(() => {
      expect(nameInput).toHaveValue(MOCK_INGREDIENT_NAME);
      expect(caloriesInput).toHaveValue(MOCK_CALORIES_PER_100G.toString());
      expect(proteinsInput).toHaveValue(MOCK_PROTEIN_PER_100G.toString());
    });
  });

  it("locks calories and proteins after barcode scan", async () => {
    simulateBarcodeScan(MOCK_BARCODE);

    const { barcodeScannerButton, caloriesInput, proteinsInput } =
      await setup();

    await userEvent.click(barcodeScannerButton);

    await waitFor(() => {
      expect(caloriesInput).toBeDisabled();
      expect(proteinsInput).toBeDisabled();
    });
  });

  it("recalculates calories and proteins when quantity changes after barcode scan", async () => {
    simulateBarcodeScan(MOCK_BARCODE);

    const { barcodeScannerButton, caloriesInput, proteinsInput } =
      await setup();

    await userEvent.click(barcodeScannerButton);

    await waitFor(() => {
      expect(caloriesInput).toHaveValue(MOCK_CALORIES_PER_100G.toString());
    });

    const quantityInput = screen.getByLabelText(/cantidad/i);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "200");

    const expectedCalories = Math.round((MOCK_CALORIES_PER_100G * 200) / 100);
    const expectedProtein = Math.round((MOCK_PROTEIN_PER_100G * 200) / 100);

    await waitFor(() => {
      expect(caloriesInput).toHaveValue(expectedCalories.toString());
      expect(proteinsInput).toHaveValue(expectedProtein.toString());
    });
  });

  it("submits correct values when barcode fills the form", async () => {
    simulateBarcodeScan(MOCK_BARCODE);

    const { barcodeScannerButton, submitButton, dayId } = await setup();

    await userEvent.click(barcodeScannerButton);

    await waitFor(() =>
      expect(screen.getByLabelText(/nombre de la comida/i)).toHaveValue(
        MOCK_INGREDIENT_NAME,
      ),
    );

    fakeMealsRepo.clearForTesting();
    await userEvent.click(submitButton);

    await waitFor(async () => {
      const createdFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      const createdFakeMeal = createdFakeMeals[0];

      expect(createdFakeMeal).toBeDefined();
      expect(createdFakeMeal?.name).toBe(MOCK_INGREDIENT_NAME);
      expect(createdFakeMeal?.calories).toBe(MOCK_CALORIES_PER_100G);
      expect(createdFakeMeal?.protein).toBe(MOCK_PROTEIN_PER_100G);
    });
  });
});
