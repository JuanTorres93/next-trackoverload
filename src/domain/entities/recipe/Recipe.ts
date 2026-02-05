import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { Text } from '@/domain/value-objects/Text/Text';
import { ValidationError } from '../../common/errors';
import { Calories } from '../../interfaces/Calories';
import { Protein } from '../../interfaces/Protein';
import { IngredientLine } from '../ingredientline/IngredientLine';

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

const nameTextOptions = {
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
      throw new ValidationError(
        'Recipe: ingredientLines must be a non-empty array of IngredientLine',
      );
    }

    // Ensure no duplicate ingredients in ingredientLines
    const ingredientIds = props.ingredientLines.map(
      (line) => line.ingredient.id,
    );
    const uniqueIngredientIds = new Set(ingredientIds);

    if (uniqueIngredientIds.size < ingredientIds.length) {
      throw new ValidationError(
        'Recipe: ingredientLines contain duplicate ingredients',
      );
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

  updateImageUrl(imageUrl: string): void {
    this.props.imageUrl = Text.create(imageUrl);
    this.props.updatedAt = DomainDate.create();
  }

  addIngredientLine(ingredientLine: IngredientLine): void {
    if (!(ingredientLine instanceof IngredientLine)) {
      throw new ValidationError('Recipe: Invalid ingredient line');
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
      throw new ValidationError(
        `Recipe: No ingredient line found with ingredient id ${idToRemove}`,
      );
    }

    // Validate that we don't leave the recipe empty
    if (filteredLines.length === 0) {
      throw new ValidationError(
        'Recipe: ingredientLines cannot be empty after removal',
      );
    }

    this.props.ingredientLines = filteredLines;
    this.props.updatedAt = DomainDate.create();
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
      throw new ValidationError(
        `Recipe: Ingredient with id ${ingredientId} already exists in recipe`,
      );
    }
  }
}
