import { logNoTest } from "@/domain/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { Calories } from "../../interfaces/Calories";
import { Protein } from "../../interfaces/Protein";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Id } from "../../value-objects/Id/Id";
import { Integer } from "../../value-objects/Integer/Integer";
import { Text } from "../../value-objects/Text/Text";
import { IngredientLine } from "../ingredientline/IngredientLine";

export type RecipeCreateProps = {
  id: string;
  userId: string;
  name: string;
  imageUrl?: string;
  ingredientLines: IngredientLine[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type RecipeProps = {
  id: Id;
  userId: Id;
  name: Text;
  imageUrl?: Text;
  ingredientLines: IngredientLine[];
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};

export class Recipe implements Protein, Calories {
  private constructor(private readonly props: RecipeProps) {}

  static create(props: RecipeCreateProps): Recipe {
    if (
      !Array.isArray(props.ingredientLines) ||
      props.ingredientLines.length === 0 ||
      !props.ingredientLines.every((line) => line instanceof IngredientLine)
    ) {
      logNoTest(
        "Recipe: ingredientLines must be a non-empty array of IngredientLine",
      );

      throw new ValidationError(
        "La receta debe tener al menos un ingrediente.",
      );
    }

    // Ensure no duplicate ingredients in ingredientLines
    const ingredientIds = props.ingredientLines.map(
      (line) => line.ingredient.id,
    );
    const uniqueIngredientIds = new Set(ingredientIds);

    if (uniqueIngredientIds.size < ingredientIds.length) {
      logNoTest("Recipe: ingredientLines contain duplicate ingredients");
      throw new ValidationError("La receta contiene ingredientes duplicados.");
    }

    const recipeProps: RecipeProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      imageUrl: props.imageUrl ? Text.create(props.imageUrl) : undefined,
      ingredientLines: props.ingredientLines,
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Recipe(recipeProps);
  }

  rename(name: string): void {
    this.props.name = Text.create(name, nameTextOptions);
    this.props.updatedAt = DomainDate.create();
  }

  updateImageUrl(imageUrl: string | undefined): void {
    this.props.imageUrl = imageUrl ? Text.create(imageUrl) : undefined;
    this.props.updatedAt = DomainDate.create();
  }

  addIngredientLine(ingredientLine: IngredientLine): void {
    if (!(ingredientLine instanceof IngredientLine)) {
      logNoTest("Recipe: Invalid ingredient line");

      throw new ValidationError("La línea de ingrediente no es válida.");
    }

    this._throwIfIngredientExists(ingredientLine.ingredient.id);

    this.props.ingredientLines.push(ingredientLine);
    this.props.updatedAt = DomainDate.create();
  }

  removeIngredientLineByIngredientId(ingredientId: string): void {
    const idToRemove = Id.create(ingredientId).value;

    const filteredLines = this.props.ingredientLines.filter(
      (line) => line.ingredient.id !== idToRemove,
    );

    // Validate that the ingredient line exists
    if (filteredLines.length === this.props.ingredientLines.length) {
      logNoTest(
        `Recipe: No ingredient line found with ingredient id ${idToRemove}`,
      );
      throw new ValidationError("El ingrediente no existe en la receta.");
    }

    // Validate that we don't leave the recipe empty
    if (filteredLines.length === 0) {
      logNoTest("Recipe: ingredientLines cannot be empty after removal");

      throw new ValidationError(
        "La receta debe tener al menos un ingrediente.",
      );
    }

    this.props.ingredientLines = filteredLines;
    this.props.updatedAt = DomainDate.create();
  }

  toCreateProps(): RecipeCreateProps {
    return {
      id: this.props.id.value,
      userId: this.props.userId.value,
      name: this.props.name.value,
      imageUrl: this.props.imageUrl?.value,
      ingredientLines: this.props.ingredientLines,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt.value,
    };
  }

  get id() {
    return this.props.id.value;
  }

  get imageUrl() {
    return this.props.imageUrl?.value;
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

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }

  get calories() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.calories,
      0,
    );
  }

  get protein() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.protein,
      0,
    );
  }

  private _throwIfIngredientExists(ingredientId: string): void {
    const ingredientAlreadyExists = this.props.ingredientLines.some(
      (line) => line.ingredient.id === ingredientId,
    );

    if (ingredientAlreadyExists) {
      logNoTest(
        `Recipe: Ingredient with id ${ingredientId} already exists in recipe`,
      );
      throw new ValidationError("El ingrediente ya existe en la receta.");
    }
  }
}
