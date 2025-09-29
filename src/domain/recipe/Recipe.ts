import { IngredientLine } from '../ingredient/IngredientLine';
import { validateNonEmptyString } from '../common/validation';
import { ValidationError } from '../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../common/utils';

export type RecipeProps = {
  id: string;
  name: string;
  ingredientLines: IngredientLine[];
  createdAt: Date;
  updatedAt: Date;
};

export class Recipe {
  private constructor(private readonly props: RecipeProps) {}

  static create(props: RecipeProps): Recipe {
    validateNonEmptyString(props.id, 'Recipe id');
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
    this.props.ingredientLines.push(ingredientLine);
    this.props.updatedAt = new Date();
  }

  removeIngredientLineByIngredientId(ingredientId: string): void {
    validateNonEmptyString(ingredientId, 'Ingredient id');
    const initialLength = this.props.ingredientLines.length;
    this.props.ingredientLines = this.props.ingredientLines.filter(
      (line) => line.ingredient.id !== ingredientId
    );
    if (this.props.ingredientLines.length === initialLength) {
      throw new ValidationError(
        `Recipe: No ingredient line found with ingredient id ${ingredientId}`
      );
    }
    if (this.props.ingredientLines.length === 0) {
      throw new ValidationError(
        'Recipe: ingredientLines cannot be empty after removal'
      );
    }
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
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

  get totalCalories() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.calories,
      0
    );
  }

  get totalProtein() {
    return this.props.ingredientLines.reduce(
      (total, line) => total + line.protein,
      0
    );
  }
}
