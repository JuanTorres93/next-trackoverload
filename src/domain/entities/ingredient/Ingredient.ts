import {
  validateNonEmptyString,
  validateGreaterThanZero,
  validatePositiveNumber,
  validateObject,
} from '../../common/validation';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';

type NutritionalInfoPer100g = {
  calories: number;
  protein: number;
};

export type IngredientUpdateProps = {
  name?: string;
  calories?: number;
  protein?: number;
};

export type IngredientProps = {
  id: string;
  name: string;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  imageUrl?: string;
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
    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Ingredient(props);
  }

  update(patch: IngredientUpdateProps): void {
    if (patch.name !== undefined) {
      validateNonEmptyString(patch.name, 'Ingredient name');
      this.props.name = patch.name;
    }
    if (patch.calories !== undefined) {
      validatePositiveNumber(
        patch.calories,
        'Ingredient nutritionalInfoPer100g calories'
      );
      this.props.nutritionalInfoPer100g.calories = patch.calories;
    }
    if (patch.protein !== undefined) {
      validatePositiveNumber(
        patch.protein,
        'Ingredient nutritionalInfoPer100g protein'
      );
      this.props.nutritionalInfoPer100g.protein = patch.protein;
    }

    this.props.updatedAt = new Date();
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

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
