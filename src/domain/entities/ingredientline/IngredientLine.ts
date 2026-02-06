import { Calories } from '@/domain/interfaces/Calories';
import { Protein } from '@/domain/interfaces/Protein';
import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Float } from '@/domain/value-objects/Float/Float';
import { Id } from '@/domain/value-objects/Id/Id';
import { ValidationError } from '../../common/errors';
import { Ingredient } from '../ingredient/Ingredient';

export type IngredientLineCreateProps = {
  id: string;
  parentId: string;
  parentType: 'meal' | 'recipe';
  ingredient: Ingredient;
  quantityInGrams: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IngredientLineUpdateProps = {
  ingredient?: Ingredient;
  quantityInGrams?: number;
};

export type IngredientLineProps = {
  id: Id;
  parentId: Id;
  parentType: 'meal' | 'recipe';
  ingredient: Ingredient;
  quantityInGrams: Float;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const quantityFloatOptions = { onlyPositive: true, canBeZero: false };

export class IngredientLine implements Calories, Protein {
  private constructor(private readonly props: IngredientLineProps) {}

  static create(props: IngredientLineCreateProps) {
    if (!(props.ingredient instanceof Ingredient)) {
      throw new ValidationError('IngredientLine: Invalid ingredient');
    }

    if (props.parentType !== 'meal' && props.parentType !== 'recipe') {
      throw new ValidationError(
        'IngredientLine: parentType must be either meal or recipe',
      );
    }

    const ingredientLineProps: IngredientLineProps = {
      id: Id.create(props.id),
      parentId: Id.create(props.parentId),
      parentType: props.parentType,
      ingredient: props.ingredient,
      quantityInGrams: Float.create(
        props.quantityInGrams,
        quantityFloatOptions,
      ),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new IngredientLine(ingredientLineProps);
  }

  update(patch: IngredientLineUpdateProps): void {
    if (
      !patch ||
      Object.keys(patch).length === 0 ||
      Object.values(patch).every((value) => value === undefined)
    ) {
      throw new ValidationError(
        'IngredientLine update must have at least one field to update',
      );
    }

    if (patch.ingredient && !(patch.ingredient instanceof Ingredient)) {
      throw new ValidationError(
        'IngredientLine update ingredient must have a valid patch',
      );
    }

    if (patch.ingredient) this.props.ingredient = patch.ingredient;

    if (patch.quantityInGrams !== undefined) {
      this.props.quantityInGrams = Float.create(
        patch.quantityInGrams,
        quantityFloatOptions,
      );
    }

    this.props.updatedAt = DomainDate.create();
  }

  get id() {
    return this.props.id.value;
  }

  get parentId() {
    return this.props.parentId.value;
  }

  get parentType() {
    return this.props.parentType;
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
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
