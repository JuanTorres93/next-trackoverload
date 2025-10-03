import { Ingredient } from './Ingredient';
import { ValidationError } from '../../common/errors';
import { validateNonEmptyString } from '../../common/validation';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';

type IngredientLineProps = {
  id: string;
  ingredient: Ingredient;
  quantityInGrams: number;
  createdAt: Date;
  updatedAt: Date;
};

export class IngredientLine {
  private constructor(private readonly props: IngredientLineProps) {}

  static create(props: IngredientLineProps) {
    validateNonEmptyString(props.id, 'IngredientLine id');
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

    return new IngredientLine(props);
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
}
