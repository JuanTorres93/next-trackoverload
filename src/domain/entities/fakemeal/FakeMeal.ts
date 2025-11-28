import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
} from '../../common/validation';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';
import { Id } from '@/domain/value-objects/Id/Id';

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
  name: string;
  calories: number;
  protein: number;
  createdAt: Date;
  updatedAt: Date;
};

export class FakeMeal implements Protein, Calories {
  private constructor(private readonly props: FakeMealProps) {}

  static create(props: FakeMealCreateProps): FakeMeal {
    validateNonEmptyString(props.name, 'FakeMeal name');
    validateGreaterThanZero(props.calories, 'FakeMeal calories');
    validateGreaterThanZero(props.protein, 'FakeMeal protein');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    const fakeMealProps: FakeMealProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: props.name,
      calories: props.calories,
      protein: props.protein,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };

    return new FakeMeal(fakeMealProps);
  }

  update(patch: FakeUpdateProps) {
    if (patch.name !== undefined) {
      validateNonEmptyString(patch.name, 'FakeMeal name');
      this.props.name = patch.name;
    }
    if (patch.calories !== undefined) {
      validateGreaterThanZero(patch.calories, 'FakeMeal calories');
      this.props.calories = patch.calories;
    }
    if (patch.protein !== undefined) {
      validateGreaterThanZero(patch.protein, 'FakeMeal protein');
      this.props.protein = patch.protein;
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
    return this.props.name;
  }

  get calories() {
    return this.props.calories;
  }

  get protein() {
    return this.props.protein;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
