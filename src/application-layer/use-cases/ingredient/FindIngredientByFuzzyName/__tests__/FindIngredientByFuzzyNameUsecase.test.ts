import { mockIngredientsForIngredientFinder } from "@/../tests/mocks/ingredients";
import { MemoryIngredientFinder } from "@/infra/services/IngredientsFinder/MemoryIngredientFinder/MemoryIngredientFinder";

import {
  FindIngredientByFuzzyNameUsecase,
  FindIngredientByFuzzyNameUsecaseRequest,
} from "../FindIngredientByFuzzyNameUsecase";

describe("FindIngredientByFuzzyNameUsecase", () => {
  const request: FindIngredientByFuzzyNameUsecaseRequest = { name: "Carrot" };

  let usecase: FindIngredientByFuzzyNameUsecase;

  beforeEach(() => {
    usecase = new FindIngredientByFuzzyNameUsecase(
      new MemoryIngredientFinder(mockIngredientsForIngredientFinder),
    );
  });

  describe("Execution", () => {
    it("returns results from the ingredient finder", async () => {
      const results = await usecase.execute(request);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].ingredient.name).toBe("Carrot");
    });

    it("each result has ingredient and externalRef properties", async () => {
      const results = await usecase.execute(request);

      for (const result of results) {
        expect(result).toHaveProperty("ingredient");
        expect(result).toHaveProperty("externalRef");
      }
    });

    it("returns empty array when no ingredients match", async () => {
      const emptyUsecase = new FindIngredientByFuzzyNameUsecase(
        new MemoryIngredientFinder([]),
      );

      const results = await emptyUsecase.execute(request);

      expect(results).toHaveLength(0);
    });

    it("returns empty array for empty name", async () => {
      const results = await usecase.execute({ name: "" });

      expect(results).toHaveLength(0);
    });

    it("returns empty array for whitespace-only name", async () => {
      const results = await usecase.execute({ name: "   " });

      expect(results).toHaveLength(0);
    });
  });
});
