import { Ingredient } from './Ingredient';
import { ValidationError } from '../common/errors';

export class IngredientLine {
  private constructor(
    private readonly props: { ingredient: Ingredient; quantityInGrams: number }
  ) {}

  static create(props: { ingredient: Ingredient; quantityInGrams: number }) {
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
