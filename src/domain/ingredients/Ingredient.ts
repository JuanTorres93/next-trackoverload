import {
  validateNonEmptyString,
  validateGreaterThanZero,
  validateDate,
  validateObject,
} from '../common/validation';

type NutritionalInfoPer100g = {
  calories: number;
  protein: number;
};

export type IngredientProps = {
  id: string;
  name: string;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  createdAt: Date;
  updatedAt: Date;
};

export class Ingredient {
  private constructor(private readonly props: IngredientProps) {}

  static create(props: IngredientProps): Ingredient {
    validateNonEmptyString(props.id, 'Ingredient id');
    validateNonEmptyString(props.name, 'Ingredient name');
    validateObject(
      props.nutritionalInfoPer100g,
      'Ingredient nutritionalInfoPer100g'
    );
    validateGreaterThanZero(
      props.nutritionalInfoPer100g.calories,
      'Ingredient nutritionalInfoPer100g calories'
    );
    validateGreaterThanZero(
      props.nutritionalInfoPer100g.protein,
      'Ingredient nutritionalInfoPer100g protein'
    );

    const now = new Date();
    if (props.createdAt) {
      validateDate(props.createdAt, 'Ingredient createdAt');
    } else {
      props.createdAt = now;
    }
    if (props.updatedAt) {
      validateDate(props.updatedAt, 'Ingredient updatedAt');
    } else {
      props.updatedAt = now;
    }

    return new Ingredient(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get nutritionalInfoPer100g() {
    return { ...this.props.nutritionalInfoPer100g };
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
