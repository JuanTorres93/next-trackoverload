import { logNoTest } from "@/utils/logNoTest";
import { IngredientCategory } from "@/domain/value-objects/IngredientCategory/IngredientCategory";

import { ValidationError } from "../../common/errors";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Float } from "../../value-objects/Float/Float";
import { Id } from "../../value-objects/Id/Id";
import { Integer } from "../../value-objects/Integer/Integer";
import { Text } from "../../value-objects/Text/Text";

type NutritionalInfoPer100g = {
  calories: Float;
  protein: Float;
};

export type IngredientCreateProps = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  imageUrl?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IngredientUpdateProps = {
  name?: string;
  calories?: number;
  protein?: number;
};

export type IngredientProps = {
  id: Id;
  name: Text;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  imageUrl?: Text;
  category: IngredientCategory;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};
export const caloriesFloatOptions = { onlyPositive: true };
export const proteinFloatOptions = { onlyPositive: true };

export class Ingredient {
  private constructor(private readonly props: IngredientProps) {}

  static create(props: IngredientCreateProps): Ingredient {
    const ingredientProps: IngredientProps = {
      ...props,
      id: Id.create(props.id),
      name: Text.create(props.name, nameTextOptions),

      nutritionalInfoPer100g: {
        calories: Float.create(props.calories, caloriesFloatOptions),
        protein: Float.create(props.protein, proteinFloatOptions),
      },

      imageUrl: props.imageUrl ? Text.create(props.imageUrl) : undefined,

      category: props.category
        ? IngredientCategory.create(props.category)
        : IngredientCategory.create("other"),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Ingredient(ingredientProps);
  }

  update(patch: IngredientUpdateProps): void {
    if (!patch || Object.keys(patch).length === 0) {
      logNoTest("Ingredient: No patch provided");

      throw new ValidationError(
        "No se han proporcionado datos para actualizar.",
      );
    }

    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }
    if (patch.calories !== undefined) {
      this.props.nutritionalInfoPer100g.calories = Float.create(
        patch.calories,
        caloriesFloatOptions,
      );
    }
    if (patch.protein !== undefined) {
      this.props.nutritionalInfoPer100g.protein = Float.create(
        patch.protein,
        proteinFloatOptions,
      );
    }

    this.props.updatedAt = DomainDate.create();
  }

  toCreateProps(): IngredientCreateProps {
    return {
      id: this.id,
      name: this.name,
      calories: this.nutritionalInfoPer100g.calories,
      protein: this.nutritionalInfoPer100g.protein,
      imageUrl: this.imageUrl,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get nutritionalInfoPer100g() {
    return {
      calories: this.props.nutritionalInfoPer100g.calories.value,
      protein: this.props.nutritionalInfoPer100g.protein.value,
    };
  }

  get imageUrl() {
    return this.props.imageUrl?.value;
  }

  get category() {
    return this.props.category.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
