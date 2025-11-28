import { Ingredient } from './Ingredient';
import { ValidationError } from '../../common/errors';
import { validateGreaterThanZero } from '../../common/validation';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Id } from '@/domain/value-objects/Id/Id';
import { Calories } from '@/domain/interfaces/Calories';
import { Protein } from '@/domain/interfaces/Protein';

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
  quantityInGrams: number;
  createdAt: Date;
  updatedAt: Date;
};

export class IngredientLine implements Calories, Protein {
  private constructor(private readonly props: IngredientLineProps) {}

  static create(props: IngredientLineCreateProps) {
    if (!(props.ingredient instanceof Ingredient)) {
      throw new ValidationError('IngredientLine: Invalid ingredient');
    }

    if (
      typeof props.quantityInGrams !== 'number' ||
      props.quantityInGrams <= 0
    ) {
      throw new ValidationError(
        'IngredientLine: quantityInGrams must be a number greater than zero'
      );
    }

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    const ingredientLineProps: IngredientLineProps = {
      id: Id.create(props.id),
      ingredient: props.ingredient,
      quantityInGrams: props.quantityInGrams,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };

    return new IngredientLine(ingredientLineProps);
  }

  update(patch: IngredientLineUpdateProps): IngredientLine {
    const newIngredient = patch.ingredient ?? this.props.ingredient;
    const newQuantity = patch.quantityInGrams ?? this.props.quantityInGrams;

    if (patch.ingredient && !(patch.ingredient instanceof Ingredient)) {
      throw new ValidationError('IngredientLine update ingredient');
    }

    if (patch.quantityInGrams !== undefined)
      validateGreaterThanZero(
        patch.quantityInGrams,
        'IngredientLine update quantityInGrams'
      );

    return IngredientLine.create({
      id: this.id,
      ingredient: newIngredient,
      quantityInGrams: newQuantity,
      createdAt: this.props.createdAt,
      updatedAt: new Date(),
    });
  }

  get id() {
    return this.props.id.value;
  }

  get ingredient() {
    return this.props.ingredient;
  }

  get quantityInGrams() {
    return this.props.quantityInGrams;
  }

  get calories() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.calories *
        this.props.quantityInGrams) /
      100
    );
  }

  get protein() {
    return (
      (this.props.ingredient.nutritionalInfoPer100g.protein *
        this.props.quantityInGrams) /
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
