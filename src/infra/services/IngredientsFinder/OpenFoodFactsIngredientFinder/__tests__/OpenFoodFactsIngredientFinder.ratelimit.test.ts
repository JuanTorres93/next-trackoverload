import { IngredientFinderResult } from "@/domain/services/IngredientFinder.port";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";

import { isRunningInCICD } from "../../../../../../tests/common/isRunningInCICD";
import { OpenFoodFactsIngredientFinder } from "../OpenFoodFactsIngredientFinder";
import { READ_RATE_LIMITS } from "../OpenFoodFactsIngredientFinder";

const shouldSkip = isRunningInCICD;

describe.skipIf(shouldSkip)("OpenFoodFactsIngredientFinder", () => {
  let ingredientFinder: OpenFoodFactsIngredientFinder;

  beforeAll(() => {
    const searchRateLimiter = new MemoryTokenBucketRateLimiter(
      READ_RATE_LIMITS.searchQueries.requests,
      READ_RATE_LIMITS.searchQueries.perMinutes,
    );

    const barcodeRateLimiter = new MemoryTokenBucketRateLimiter(
      READ_RATE_LIMITS.productQueries.requests,
      READ_RATE_LIMITS.productQueries.perMinutes,
    );

    ingredientFinder = new OpenFoodFactsIngredientFinder(
      searchRateLimiter,
      barcodeRateLimiter,
      "test-client",
    );
  });

  describe("Find by name", () => {
    let results: IngredientFinderResult[];

    beforeAll(async () => {
      results = await ingredientFinder.findIngredientsByFuzzyName("Arroz");
    });

    it("returns ingredient and externalRef properties", async () => {
      expect(results.length).toBeGreaterThan(0);

      for (const result of results) {
        expect(result).toHaveProperty("ingredient");
        expect(result).toHaveProperty("externalRef");
      }
    });

    it("ingredient prop has correct properties", async () => {
      const { ingredient } = results[0];

      expect(ingredient).toHaveProperty("name");
      expect(ingredient).toHaveProperty("nutritionalInfoPer100g");
      expect(ingredient).toHaveProperty("imageUrl");
    });

    it("externalRef prop has correct properties", async () => {
      const { externalRef } = results[0];

      expect(externalRef).toHaveProperty("externalId");
      expect(externalRef.externalId).toBeDefined();

      expect(externalRef).toHaveProperty("source");
      expect(externalRef.source).toBeDefined();
    });
  });

  describe("Find by barcode", () => {
    let results: IngredientFinderResult[];

    beforeAll(async () => {
      results =
        await ingredientFinder.findIngredientsByBarcode("8414807558305");
    });

    it("returns ingredient and externalRef properties", async () => {
      expect(results.length).toBeGreaterThan(0);

      for (const result of results) {
        expect(result).toHaveProperty("ingredient");
        expect(result).toHaveProperty("externalRef");
      }
    });

    it("ingredient prop has correct properties", async () => {
      const { ingredient } = results[0];

      expect(ingredient).toHaveProperty("name");
      expect(ingredient).toHaveProperty("nutritionalInfoPer100g");
      expect(ingredient).toHaveProperty("imageUrl");
    });

    it("externalRef prop has correct properties", async () => {
      const { externalRef } = results[0];

      expect(externalRef).toHaveProperty("externalId");
      expect(externalRef).toHaveProperty("source");
    });
  });
});
