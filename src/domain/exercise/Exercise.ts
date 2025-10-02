import { handleCreatedAt, handleUpdatedAt } from '../common/utils';
import { validateNonEmptyString } from '../common/validation';

export type ExerciseUpdateProps = {
  name?: string;
};

export type ExerciseProps = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Exercise {
  private constructor(private readonly props: ExerciseProps) {}

  static create(props: ExerciseProps): Exercise {
    validateNonEmptyString(props.id, 'Exercise id');
    validateNonEmptyString(props.name, 'Exercise name');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Exercise(props);
  }

  get id() {
    return this.props.id;
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
