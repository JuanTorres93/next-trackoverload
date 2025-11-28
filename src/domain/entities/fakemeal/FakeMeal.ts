import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
} from '../../common/validation';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';
import { Id } from '@/domain/value-objects/Id/Id';
import { ValidationError } from '@/domain/common/errors';

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

  static create(props: FakeMealProps): FakeMeal {
    if (!(props.id instanceof Id))
      throw new ValidationError('FakeMeal: id must be an instance of Id');

    if (!(props.userId instanceof Id))
      throw new ValidationError('FakeMeal: userId must be an instance of Id');

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
