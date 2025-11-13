import { IngredientLine } from '../ingredient/IngredientLine';
import { validateNonEmptyString } from '../../common/validation';
import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';

export type RecipeProps = {
  id: string;
  userId: string;
  name: string;
  imageUrl?: string;
  ingredientLines: IngredientLine[];
  createdAt: Date;
  updatedAt: Date;
};

export class Recipe implements Protein, Calories {
  private constructor(private readonly props: RecipeProps) {}

  static create(props: RecipeProps): Recipe {
    validateNonEmptyString(props.id, 'Recipe id');
    validateNonEmptyString(props.userId, 'Recipe userId');
    validateNonEmptyString(props.name, 'Recipe name');

    if (
      !Array.isArray(props.ingredientLines) ||
      props.ingredientLines.length === 0 ||
      !props.ingredientLines.every((line) => line instanceof IngredientLine)
    ) {
      throw new ValidationError(
        'Recipe: ingredientLines must be a non-empty array of IngredientLine'
      );
    }

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Recipe(props);
  }

  rename(name: string): void {
    validateNonEmptyString(name, 'Recipe name');
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  addIngredientLine(ingredientLine: IngredientLine): void {
    if (!(ingredientLine instanceof IngredientLine)) {
      throw new ValidationError('Recipe: Invalid ingredient line');
    }

    const ingredientAlreadyExists = this.props.ingredientLines.some(
      (line) => line.ingredient.id === ingredientLine.ingredient.id
    );

    if (ingredientAlreadyExists) {
      throw new ValidationError(
        `Recipe: Ingredient with id ${ingredientLine.ingredient.id} already exists in recipe`
      );
    }

    this.props.ingredientLines.push(ingredientLine);
    this.props.updatedAt = new Date();
  }

  removeIngredientLineByIngredientId(ingredientId: string): void {
    validateNonEmptyString(ingredientId, 'Ingredient id');

    const filteredLines = this.props.ingredientLines.filter(
      (line) => line.ingredient.id !== ingredientId
    );

    // Validate that the ingredient line existed
    if (filteredLines.length === this.props.ingredientLines.length) {
      throw new ValidationError(
        `Recipe: No ingredient line found with ingredient id ${ingredientId}`
      );
    }

    // Validate that we don't leave the recipe empty
    if (filteredLines.length === 0) {
      throw new ValidationError(
        'Recipe: ingredientLines cannot be empty after removal'
      );
    }

    this.props.ingredientLines = filteredLines;
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get ingredientLines() {
    return [...this.props.ingredientLines];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get calories() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.calories,
      0
    );
  }

  get protein() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.protein,
      0
    );
  }
}
