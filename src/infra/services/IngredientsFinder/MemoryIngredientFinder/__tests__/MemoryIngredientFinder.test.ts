import { mockIngredientsForIngredientFinder } from "@/../tests/mocks/ingredients";
import { IngredientFinderResult } from "@/domain/services/IngredientFinder.port";

import MemoryIngredientFinder from "../MemoryIngredientFinder";

describe("MemoryIngredientFinder", () => {
  let ingredientFinder: MemoryIngredientFinder;

  beforeAll(() => {
    ingredientFinder = new MemoryIngredientFinder(
      mockIngredientsForIngredientFinder as IngredientFinderResult[],
    );
  });

  describe("findIngredientsByFuzzyName", () => {
    it("returns results for partial name matches", async () => {
      const results = await ingredientFinder.findIngredientsByFuzzyName("Car");

      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r).toHaveProperty("ingredient");
        expect(r).toHaveProperty("externalRef");
      }
    });

    it("is case-insensitive and returns empty for empty term", async () => {
      const up = await ingredientFinder.findIngredientsByFuzzyName("carrot");
      const empty = await ingredientFinder.findIngredientsByFuzzyName("");

      expect(up.length).toBeGreaterThan(0);
      expect(empty.length).toBe(0);
    });
  });
});
