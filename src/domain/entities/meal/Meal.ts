import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { validateNonEmptyString } from '../../common/validation';
import { IngredientLine } from '../ingredient/IngredientLine';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';

export type MealProps = {
  id: string;
  name: string;
  ingredientLines: IngredientLine[];
  createdAt: Date;
  updatedAt: Date;
};

export class Meal implements Calories, Protein {
  private constructor(private readonly props: MealProps) {}

  static create(props: MealProps): Meal {
    validateNonEmptyString(props.id, 'Meal id');
    validateNonEmptyString(props.name, 'Meal name');

    if (
      !Array.isArray(props.ingredientLines) ||
      props.ingredientLines.length === 0 ||
      !props.ingredientLines.every((line) => line instanceof IngredientLine)
    ) {
      throw new ValidationError(
        'Meal: ingredientLines must be a non-empty array of IngredientLine'
      );
    }

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Meal(props);
  }

  addIngredientLine(ingredientLine: IngredientLine): void {
    if (!(ingredientLine instanceof IngredientLine)) {
      throw new ValidationError('Meal: Invalid ingredient line');
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
        `Meal: No ingredient line found with ingredient id ${ingredientId}`
      );
    }
    this.props.updatedAt = new Date();
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
}
