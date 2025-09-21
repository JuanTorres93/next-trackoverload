import { validateNonEmptyString, validateDate } from '../common/validation';

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

    const now = new Date();
    if (props.createdAt) {
      validateDate(props.createdAt, 'Exercise createdAt');
    } else {
      props.createdAt = now;
    }
    if (props.updatedAt) {
      validateDate(props.updatedAt, 'Exercise updatedAt');
    } else {
      props.updatedAt = now;
    }

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
