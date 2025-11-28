import { Id } from '@/domain/value-objects/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { validateNonEmptyString } from '../../common/validation';

export type ExerciseCreateProps = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

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

  static create(props: ExerciseCreateProps): Exercise {
    validateNonEmptyString(props.name, 'Exercise name');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    const exerciseProps: ExerciseProps = {
      id: Id.create(props.id),
      name: props.name,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };

    return new Exercise(exerciseProps);
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
