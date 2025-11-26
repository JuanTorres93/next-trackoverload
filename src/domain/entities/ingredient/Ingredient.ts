import {
  validateNonEmptyString,
  validateGreaterThanZero,
  validatePositiveNumber,
  validateObject,
} from '../../common/validation';
import { Id } from '@/domain/types/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { ValidationError } from '@/domain/common/errors';

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
  id: Id;
  name: string;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Ingredient {
  private constructor(private readonly props: IngredientProps) {}

  static create(props: IngredientProps): Ingredient {
    if (!(props.id instanceof Id))
      throw new ValidationError('Ingredient: id must be of type Id');

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
    return this.props.id.value;
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
