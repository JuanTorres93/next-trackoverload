import { Ingredient } from './Ingredient';
import { ValidationError } from '../../common/errors';
import { validateGreaterThanZero } from '../../common/validation';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Id } from '@/domain/value-objects/Id/Id';
import { Calories } from '@/domain/interfaces/Calories';
import { Protein } from '@/domain/interfaces/Protein';
import { Float } from '@/domain/value-objects/Float/Float';

export type IngredientLineCreateProps = {
  id: string;
  ingredient: Ingredient;
  quantityInGrams: number;
  createdAt: Date;
  updatedAt: Date;
};

export type IngredientLineUpdateProps = {
  ingredient?: Ingredient;
  quantityInGrams?: number;
};

export type IngredientLineProps = {
  id: Id;
  ingredient: Ingredient;
  quantityInGrams: Float;
  createdAt: Date;
  updatedAt: Date;
};

const quantityFloatOptions = { onlyPositive: true, canBeZero: false };

export class IngredientLine implements Calories, Protein {
  private constructor(private readonly props: IngredientLineProps) {}

  static create(props: IngredientLineCreateProps) {
    if (!(props.ingredient instanceof Ingredient)) {
      throw new ValidationError('IngredientLine: Invalid ingredient');
    }

    const ingredientLineProps: IngredientLineProps = {
      id: Id.create(props.id),
      ingredient: props.ingredient,
      quantityInGrams: Float.create(
        props.quantityInGrams,
        quantityFloatOptions
      ),
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new IngredientLine(ingredientLineProps);
  }

  update(patch: IngredientLineUpdateProps): void {
    if (patch.ingredient && !(patch.ingredient instanceof Ingredient)) {
      throw new ValidationError('IngredientLine update ingredient');
    }

    if (patch.ingredient) this.props.ingredient = patch.ingredient;

    if (patch.quantityInGrams !== undefined) {
      validateGreaterThanZero(
        patch.quantityInGrams,
        'IngredientLine update quantityInGrams'
      );

      this.props.quantityInGrams = Float.create(
        patch.quantityInGrams,
        quantityFloatOptions
      );
    }

    this.props.updatedAt = handleUpdatedAt(this.props.updatedAt);
  }

  get id() {
    return this.props.id.value;
  }

  get ingredient() {
    return this.props.ingredient;
  }

  get quantityInGrams() {
    return this.props.quantityInGrams.value;
  }

  get calories() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.calories *
        this.props.quantityInGrams.value) /
      100
    );
  }

  get protein() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.protein *
        this.props.quantityInGrams.value) /
      100
    );
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
