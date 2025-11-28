import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { Text } from '@/domain/value-objects/Text/Text';
import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { validateNonEmptyString } from '../../common/validation';
import { Calories } from '../../interfaces/Calories';
import { Protein } from '../../interfaces/Protein';
import { IngredientLine } from '../ingredientline/IngredientLine';

export type MealCreateProps = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLine[];
  createdAt: Date;
  updatedAt: Date;
};

export type MealUpdateProps = {
  name?: string;
};

export type MealProps = {
  id: Id;
  userId: Id;
  name: Text;
  ingredientLines: IngredientLine[];
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = { canBeEmpty: false, maxLength: Integer.create(100) };

export class Meal implements Calories, Protein {
  private constructor(private readonly props: MealProps) {}

  static create(props: MealCreateProps): Meal {
    if (
      !Array.isArray(props.ingredientLines) ||
      props.ingredientLines.length === 0 ||
      !props.ingredientLines.every((line) => line instanceof IngredientLine)
    ) {
      throw new ValidationError(
        'Meal: ingredientLines must be a non-empty array of IngredientLine'
      );
    }

    const mealProps: MealProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      ingredientLines: props.ingredientLines,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Meal(mealProps);
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

  update(patch: MealUpdateProps): void {
    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
