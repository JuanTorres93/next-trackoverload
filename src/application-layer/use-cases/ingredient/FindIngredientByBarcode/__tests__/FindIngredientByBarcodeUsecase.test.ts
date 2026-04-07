import { mockIngredientsForIngredientFinder } from "@/../tests/mocks/ingredients";
import { MemoryIngredientFinder } from "@/infra/services/IngredientsFinder/MemoryIngredientFinder/MemoryIngredientFinder";

import {
  FindIngredientByBarcodeUsecase,
  FindIngredientByBarcodeUsecaseRequest,
} from "../FindIngredientByBarcodeUsecase";

describe("FindIngredientByBarcodeUsecase", () => {
  const request: FindIngredientByBarcodeUsecaseRequest = {
    barcode: "external-id-1",
  };

  let usecase: FindIngredientByBarcodeUsecase;

  beforeEach(() => {
    usecase = new FindIngredientByBarcodeUsecase(
      new MemoryIngredientFinder(mockIngredientsForIngredientFinder),
    );
  });

  describe("Execution", () => {
    it("returns the matching ingredient for an exact barcode", async () => {
      const results = await usecase.execute(request);

      expect(results).toHaveLength(1);
      expect(results[0].externalRef.externalId).toBe("external-id-1");
    });

    it("each result has ingredient and externalRef properties", async () => {
      const results = await usecase.execute(request);

      for (const result of results) {
        expect(result).toHaveProperty("ingredient");
        expect(result).toHaveProperty("externalRef");
      }
    });

    it("returns empty array when no ingredient matches the barcode", async () => {
      const results = await usecase.execute({ barcode: "unknown-barcode" });

      expect(results).toHaveLength(0);
    });

    it("returns empty array for empty barcode", async () => {
      const results = await usecase.execute({ barcode: "" });

      expect(results).toHaveLength(0);
    });

    it("returns empty array for whitespace-only barcode", async () => {
      const results = await usecase.execute({ barcode: "   " });

      expect(results).toHaveLength(0);
    });
  });
});
