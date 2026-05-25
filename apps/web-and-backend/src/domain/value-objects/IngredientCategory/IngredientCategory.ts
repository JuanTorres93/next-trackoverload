import { logNoTest } from "@/domain/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { ValueObject } from "../ValueObject";

export const VALID_INGREDIENT_CATEGORIES = [
  "vegetables",
  "fruits",
  "meat", // Meat and poultry
  "fish", // Fish and seafood
  "dairy", // Dairy and eggs
  "grains", // Cereals, bread, pasta, rice
  "legumes", // Legumes
  "nuts", // Nuts and seeds
  "fats", // Oils and fats
  "beverages", // Beverages
  "supplements", // Supplements and protein powders
  "other", // Unclassified
] as const;

export type IngredientCategoryValue =
  (typeof VALID_INGREDIENT_CATEGORIES)[number];

type IngredientCategoryProps = {
  value: IngredientCategoryValue;
};

export class IngredientCategory extends ValueObject<IngredientCategoryProps> {
  private readonly _value: IngredientCategoryValue;

  private constructor(props: IngredientCategoryProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string): IngredientCategory {
    if (
      !VALID_INGREDIENT_CATEGORIES.includes(value as IngredientCategoryValue)
    ) {
      logNoTest(
        `IngredientCategory: value must be one of [${VALID_INGREDIENT_CATEGORIES.join(", ")}]`,
      );
      throw new ValidationError(`La categoría del ingrediente no es válida.}.`);
    }

    return new IngredientCategory({ value: value as IngredientCategoryValue });
  }

  get value(): IngredientCategoryValue {
    return this._value;
  }
}
