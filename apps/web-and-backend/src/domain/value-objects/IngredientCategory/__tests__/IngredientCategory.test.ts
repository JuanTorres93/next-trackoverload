import { ValidationError } from "../../../common/errors";
import {
  IngredientCategory,
  VALID_INGREDIENT_CATEGORIES,
} from "../IngredientCategory";

describe("IngredientCategory", () => {
  describe("valid values", () => {
    it.each(VALID_INGREDIENT_CATEGORIES)(
      'should create IngredientCategory with value "%s"',
      (category) => {
        const ingredientCategory = IngredientCategory.create(category);

        expect(ingredientCategory).toBeInstanceOf(IngredientCategory);
        expect(ingredientCategory.value).toBe(category);
      },
    );
  });

  describe("invalid values", () => {
    it("should throw ValidationError for an unknown category", () => {
      expect(() => IngredientCategory.create("sweets")).toThrow(
        ValidationError,
      );
    });

    it("should throw ValidationError for an empty string", () => {
      expect(() => IngredientCategory.create("")).toThrow(ValidationError);
    });

    it("should throw ValidationError for a non-string value", () => {
      // @ts-expect-error testing invalid input
      expect(() => IngredientCategory.create(123)).toThrow(ValidationError);
    });

    it("should include valid categories in the error message", () => {
      expect(() => IngredientCategory.create("invalid")).toThrow(
        /vegetables.*fruits.*meat|categoría.*ingrediente/i,
      );
    });
  });

  describe("equals", () => {
    it("should be equal to another IngredientCategory with the same value", () => {
      const a = IngredientCategory.create("meat");
      const b = IngredientCategory.create("meat");
      expect(a.equals(b)).toBe(true);
    });

    it("should not be equal to an IngredientCategory with a different value", () => {
      const a = IngredientCategory.create("meat");
      const b = IngredientCategory.create("fish");
      expect(a.equals(b)).toBe(false);
    });
  });
});
