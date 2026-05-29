import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { Calories } from "../../interfaces/Calories";
import { Protein } from "../../interfaces/Protein";
import { Bool } from "../../value-objects/Boolean/Boolean";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Id } from "../../value-objects/Id/Id";
import { Integer } from "../../value-objects/Integer/Integer";
import { Text } from "../../value-objects/Text/Text";
import { IngredientLine } from "../ingredientline/IngredientLine";

export type MealCreateProps = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLine[];
  createdFromRecipeId: string;
  isEaten?: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MealUpdateProps = {
  name?: string;
};

export type MealProps = {
  id: Id;
  userId: Id;
  name: Text;
  ingredientLines: IngredientLine[];
  createdFromRecipeId: Id;
  isEaten?: Bool;
  imageUrl?: Text;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};

export class Meal implements Calories, Protein {
  private constructor(private readonly props: MealProps) {}

  static create(props: MealCreateProps): Meal {
    if (
      !Array.isArray(props.ingredientLines) ||
      props.ingredientLines.length === 0 ||
      !props.ingredientLines.every((line) => line instanceof IngredientLine)
    ) {
      logNoTest(
        "Meal: ingredientLines must be a non-empty array of IngredientLine",
      );

      throw new ValidationError(
        "La comida debe tener al menos un ingrediente.",
      );
    }

    const mealProps: MealProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      ingredientLines: props.ingredientLines,
      createdFromRecipeId: Id.create(props.createdFromRecipeId),
      isEaten: props.isEaten ? Bool.create(props.isEaten) : undefined,
      imageUrl: props.imageUrl ? Text.create(props.imageUrl) : undefined,
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Meal(mealProps);
  }

  addIngredientLine(ingredientLine: IngredientLine): void {
    if (!(ingredientLine instanceof IngredientLine)) {
      logNoTest("Meal: Invalid ingredient line");

      throw new ValidationError("La línea de ingrediente no es válida.");
    }

    const exists = this.props.ingredientLines.some(
      (line) => line.ingredient.id === ingredientLine.ingredient.id,
    );

    if (exists) {
      logNoTest(
        `Meal: Ingredient with id ${ingredientLine.ingredient.id} already exists in the meal`,
      );

      throw new ValidationError("El ingrediente ya existe en la comida.");
    }

    this.props.ingredientLines.push(ingredientLine);
    this.props.updatedAt = DomainDate.create();
  }

  removeIngredientLineByIngredientId(ingredientId: string): void {
    const initialLength = this.props.ingredientLines.length;
    const memoryComputation = this.props.ingredientLines.filter(
      (line) => line.ingredient.id !== ingredientId,
    );

    if (memoryComputation.length === 0) {
      logNoTest("Meal: At least one ingredient line must exist in the meal");

      throw new ValidationError(
        "La comida debe tener al menos un ingrediente.",
      );
    }

    if (memoryComputation.length === initialLength) {
      logNoTest(
        `Meal: No ingredient line found with ingredient id ${ingredientId}`,
      );
      throw new ValidationError("El ingrediente no existe en la comida.");
    }

    this.props.ingredientLines = memoryComputation;
    this.props.updatedAt = DomainDate.create();
  }

  update(patch: MealUpdateProps): void {
    if (
      !patch ||
      Object.keys(patch).length === 0 ||
      Object.values(patch).every((value) => value === undefined)
    ) {
      logNoTest("Meal: No properties provided in patch for update");

      throw new ValidationError(
        "No se han proporcionado datos para actualizar.",
      );
    }

    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }

    this.props.updatedAt = DomainDate.create();
  }

  toggleIsEaten(): void {
    this.props.isEaten = Bool.create(!this.isEaten);
    this.props.updatedAt = DomainDate.create();
  }

  toCreateProps(): MealCreateProps {
    return {
      id: this.props.id.value,
      userId: this.props.userId.value,
      name: this.props.name.value,
      ingredientLines: this.props.ingredientLines,
      createdFromRecipeId: this.props.createdFromRecipeId.value,
      isEaten: this.props.isEaten?.value,
      imageUrl: this.props.imageUrl?.value,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt.value,
    };
  }

  get calories(): number {
    return this.props.ingredientLines.reduce((total, line) => {
      const caloriesPerGram =
        line.ingredient.nutritionalInfoPer100g.calories / 100;
      return total + caloriesPerGram * line.quantityInGrams;
    }, 0);
  }

  get protein(): number {
    return this.props.ingredientLines.reduce((total, line) => {
      const proteinPerGram =
        line.ingredient.nutritionalInfoPer100g.protein / 100;
      return total + proteinPerGram * line.quantityInGrams;
    }, 0);
  }

  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get name() {
    return this.props.name.value;
  }

  get ingredientLines() {
    return [...this.props.ingredientLines];
  }

  get isEaten() {
    return this.props.isEaten?.value;
  }

  get createdFromRecipeId() {
    return this.props.createdFromRecipeId.value;
  }

  get imageUrl() {
    return this.props.imageUrl?.value || undefined;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
