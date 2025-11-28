import { Float } from '@/domain/value-objects/Float/Float';
import { Id } from '@/domain/value-objects/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Calories } from '../../interfaces/Calories';
import { Protein } from '../../interfaces/Protein';
import { Text } from '@/domain/value-objects/Text/Text';
import { Integer } from '@/domain/value-objects/Integer/Integer';

export type FakeMealCreateProps = {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FakeUpdateProps = {
  name?: string;
  calories?: number;
  protein?: number;
};

export type FakeMealProps = {
  id: Id;
  userId: Id;
  name: Text;
  calories: Float;
  protein: Float;
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = { canBeEmpty: false, maxLength: Integer.create(100) };
const caloriesFloatOptions = { onlyPositive: true };
const proteinFloatOptions = { onlyPositive: true };

export class FakeMeal implements Protein, Calories {
  private constructor(private readonly props: FakeMealProps) {}

  static create(props: FakeMealCreateProps): FakeMeal {
    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    const fakeMealProps: FakeMealProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      calories: Float.create(props.calories, caloriesFloatOptions),
      protein: Float.create(props.protein, proteinFloatOptions),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };

    return new FakeMeal(fakeMealProps);
  }

  update(patch: FakeUpdateProps) {
    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }
    if (patch.calories !== undefined) {
      this.props.calories = Float.create(patch.calories, caloriesFloatOptions);
    }
    if (patch.protein !== undefined) {
      this.props.protein = Float.create(patch.protein, proteinFloatOptions);
    }
    this.props.updatedAt = handleUpdatedAt(this.props.updatedAt);
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get name() {
    return this.props.name.value;
  }

  get calories() {
    return this.props.calories.value;
  }

  get protein() {
    return this.props.protein.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
