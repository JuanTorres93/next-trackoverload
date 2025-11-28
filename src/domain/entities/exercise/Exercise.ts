import { Id } from '@/domain/value-objects/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { validateNonEmptyString } from '../../common/validation';
import { ValidationError } from '@/domain/common/errors';

export type ExerciseUpdateProps = {
  name?: string;
};

export type ExerciseProps = {
  id: Id;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Exercise {
  private constructor(private readonly props: ExerciseProps) {}

  static create(props: ExerciseProps): Exercise {
    if (!(props.id instanceof Id))
      throw new ValidationError('Exercise: id must be an instance of Id');
    validateNonEmptyString(props.name, 'Exercise name');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Exercise(props);
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
