import { Float } from '@/domain/value-objects/Float/Float';
import { Id } from '@/domain/value-objects/Id/Id';
import { Text } from '@/domain/value-objects/Text/Text';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Integer } from '@/domain/value-objects/Integer/Integer';

type NutritionalInfoPer100g = {
  calories: Float;
  protein: Float;
};

export type IngredientCreateProps = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IngredientUpdateProps = {
  name?: string;
  calories?: number;
  protein?: number;
};

export type IngredientProps = {
  id: Id;
  name: Text;
  nutritionalInfoPer100g: NutritionalInfoPer100g;
  imageUrl?: Text;
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = { canBeEmpty: false, maxLength: Integer.create(100) };
const caloriesFloatOptions = { onlyPositive: true };
const proteinFloatOptions = { onlyPositive: true };

export class Ingredient {
  private constructor(private readonly props: IngredientProps) {}

  static create(props: IngredientCreateProps): Ingredient {
    const ingredientProps: IngredientProps = {
      ...props,
      id: Id.create(props.id),
      name: Text.create(props.name, nameTextOptions),
      nutritionalInfoPer100g: {
        calories: Float.create(props.calories, caloriesFloatOptions),
        protein: Float.create(props.protein, proteinFloatOptions),
      },
      imageUrl: props.imageUrl ? Text.create(props.imageUrl) : undefined,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Ingredient(ingredientProps);
  }

  update(patch: IngredientUpdateProps): void {
    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }
    if (patch.calories !== undefined) {
      this.props.nutritionalInfoPer100g.calories = Float.create(
        patch.calories,
        caloriesFloatOptions
      );
    }
    if (patch.protein !== undefined) {
      this.props.nutritionalInfoPer100g.protein = Float.create(
        patch.protein,
        proteinFloatOptions
      );
    }

    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get nutritionalInfoPer100g() {
    return {
      calories: this.props.nutritionalInfoPer100g.calories.value,
      protein: this.props.nutritionalInfoPer100g.protein.value,
    };
  }

  get imageUrl() {
    return this.props.imageUrl?.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
