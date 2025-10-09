import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
} from '../../common/validation';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';

export type FakeUpdateProps = {
  name?: string;
  calories?: number;
  protein?: number;
};

export type FakeMealProps = {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: Date;
  updatedAt: Date;
};

export class FakeMeal implements Protein, Calories {
  private constructor(private readonly props: FakeMealProps) {}

  static create(props: FakeMealProps): FakeMeal {
    validateNonEmptyString(props.id, 'FakeMeal id');
    validateNonEmptyString(props.userId, 'FakeMeal userId');
    validateNonEmptyString(props.name, 'FakeMeal name');
    validateGreaterThanZero(props.calories, 'FakeMeal calories');
    validateGreaterThanZero(props.protein, 'FakeMeal protein');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new FakeMeal(props);
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
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
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
