import {
  validateString,
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
  quantityInGrams: number;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  createdAt: Date;
  updatedAt: Date;
};

export class Ingredient {
  private constructor(private readonly props: IngredientProps) {}

  static create(props: IngredientProps): Ingredient {
    validateString(props.id, 'Ingredient id');
    validateString(props.name, 'Ingredient name');
    validateGreaterThanZero(
      props.quantityInGrams,
      'Ingredient quantityInGrams'
    );
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

  get quantityInGrams() {
    return this.props.quantityInGrams;
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

  get totalCalories() {
    return (
      (this.props.nutritionalInfoPer100g.calories *
        this.props.quantityInGrams) /
      100
    );
  }

  get totalProtein() {
    return (
      (this.props.nutritionalInfoPer100g.protein * this.props.quantityInGrams) /
      100
    );
  }
}
