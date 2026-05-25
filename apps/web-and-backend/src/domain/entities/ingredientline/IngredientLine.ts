import { logNoTest } from "@/domain/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { Calories } from "../../interfaces/Calories";
import { Protein } from "../../interfaces/Protein";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Float } from "../../value-objects/Float/Float";
import { Id } from "../../value-objects/Id/Id";
import { Ingredient } from "../ingredient/Ingredient";

export type IngredientLineCreateProps = {
  id: string;
  parentId: string;
  parentType: "meal" | "recipe";
  ingredient: Ingredient;
  quantityInGrams: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IngredientLineUpdateProps = {
  ingredient?: Ingredient;
  quantityInGrams?: number;
};

export type IngredientLineProps = {
  id: Id;
  parentId: Id;
  parentType: "meal" | "recipe";
  ingredient: Ingredient;
  quantityInGrams: Float;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const quantityFloatOptions = { onlyPositive: true, canBeZero: false };

export class IngredientLine implements Calories, Protein {
  private constructor(private readonly props: IngredientLineProps) {}

  static create(props: IngredientLineCreateProps) {
    if (!(props.ingredient instanceof Ingredient)) {
      logNoTest("IngredientLine: Invalid ingredient");

      throw new ValidationError("El ingrediente no es válido.");
    }

    if (props.parentType !== "meal" && props.parentType !== "recipe") {
      logNoTest("IngredientLine: parentType must be either meal or recipe");
      throw new ValidationError("El tipo de padre debe ser 'meal' o 'recipe'.");
    }

    const ingredientLineProps: IngredientLineProps = {
      id: Id.create(props.id),
      parentId: Id.create(props.parentId),
      parentType: props.parentType,
      ingredient: props.ingredient,
      quantityInGrams: Float.create(
        props.quantityInGrams,
        quantityFloatOptions,
      ),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new IngredientLine(ingredientLineProps);
  }

  update(patch: IngredientLineUpdateProps): void {
    if (
      !patch ||
      Object.keys(patch).length === 0 ||
      Object.values(patch).every((value) => value === undefined)
    ) {
      logNoTest("IngredientLine update must have at least one field to update");

      throw new ValidationError(
        "Se necesita al menos un campo para actualizar.",
      );
    }

    if (patch.ingredient && !(patch.ingredient instanceof Ingredient)) {
      logNoTest("IngredientLine update ingredient must have a valid patch");

      throw new ValidationError(
        "El ingrediente de actualización no es válido.",
      );
    }

    if (patch.ingredient) this.props.ingredient = patch.ingredient;

    if (patch.quantityInGrams !== undefined) {
      this.props.quantityInGrams = Float.create(
        patch.quantityInGrams,
        quantityFloatOptions,
      );
    }

    this.props.updatedAt = DomainDate.create();
  }

  get id() {
    return this.props.id.value;
  }

  get parentId() {
    return this.props.parentId.value;
  }

  get parentType() {
    return this.props.parentType;
  }

  get ingredient() {
    return this.props.ingredient;
  }

  get quantityInGrams() {
    return this.props.quantityInGrams.value;
  }

  get calories() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.calories *
        this.props.quantityInGrams.value) /
      100
    );
  }

  get protein() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.protein *
        this.props.quantityInGrams.value) /
      100
    );
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
