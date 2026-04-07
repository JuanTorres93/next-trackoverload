import { mockIngredientsForIngredientFinder } from "@/../tests/mocks/ingredients";
import MemoryIngredientFinder from "@/infra/services/IngredientsFinder/MemoryIngredientFinder/MemoryIngredientFinder";

import { FindIngredientByFuzzyNameUsecase } from "../FindIngredientByFuzzyNameUsecase";

describe("FindIngredientByFuzzyNameUsecase", () => {
  let usecase: FindIngredientByFuzzyNameUsecase;

  beforeAll(() => {
    const finder = new MemoryIngredientFinder(
      mockIngredientsForIngredientFinder,
    );
    usecase = new FindIngredientByFuzzyNameUsecase(finder);
  });

  it("returns fuzzy-matched ingredients", async () => {
    const results = await usecase.execute({ name: "Car" });

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r).toHaveProperty("ingredient");
      expect(r).toHaveProperty("externalRef");
    }
  });
});
