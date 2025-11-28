import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { Text } from '@/domain/value-objects/Text/Text';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';

export type UserCreateProps = {
  id: string;
  name: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserUpdateProps = {
  name?: string;
  customerId?: string;
};

export type UserProps = {
  id: Id;
  name: Text;
  customerId?: Id;
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserCreateProps): User {
    const userProps: UserProps = {
      id: Id.create(props.id),
      name: Text.create(props.name, nameTextOptions),
      customerId: props.customerId ? Id.create(props.customerId) : undefined,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new User(userProps);
  }

  update(patch: UserUpdateProps): void {
    if (patch.name) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }

    if (patch.customerId) {
      this.props.customerId = Id.create(patch.customerId);
    }

    this.props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get customerId() {
    return this.props.customerId?.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
