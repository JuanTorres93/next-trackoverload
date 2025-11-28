import { Id } from '@/domain/value-objects/Id/Id';
import { Text } from '@/domain/value-objects/Text/Text';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Integer } from '@/domain/value-objects/Integer/Integer';

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
  name: Text;
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = {
  maxLength: Integer.create(100),
  canBeEmpty: false,
};

export class Exercise {
  private constructor(private readonly props: ExerciseProps) {}

  static create(props: ExerciseCreateProps): Exercise {
    const exerciseProps: ExerciseProps = {
      id: Id.create(props.id),
      name: Text.create(props.name, nameTextOptions),
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Exercise(exerciseProps);
  }

  update(patch: ExerciseUpdateProps): void {
    if (patch.name) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
