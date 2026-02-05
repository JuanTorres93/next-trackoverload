import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Email } from '@/domain/value-objects/Email/Email';
import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { Text } from '@/domain/value-objects/Text/Text';
import { ValidationError } from '@/domain/common/errors';

export type UserCreateProps = {
  id: string;
  name: string;
  email: string;
  customerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserUpdateProps = {
  name?: string;
  customerId?: string;
};

export type UserProps = {
  id: Id;
  name: Text;
  email: Email;
  customerId?: Id;
  createdAt: DomainDate;
  updatedAt: DomainDate;
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
      email: Email.create(props.email),
      customerId: props.customerId ? Id.create(props.customerId) : undefined,
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new User(userProps);
  }

  update(patch: UserUpdateProps): void {
    // or every entry undefined
    if (
      !patch ||
      Object.keys(patch).length === 0 ||
      typeof patch !== 'object' ||
      Object.values(patch).every((value) => value === undefined)
    ) {
      throw new ValidationError('User update: patch object is required');
    }

    if (patch.name) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }

    if (patch.customerId) {
      this.props.customerId = Id.create(patch.customerId);
    }

    this.props.updatedAt = DomainDate.create();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get email() {
    return this.props.email.value;
  }

  get customerId() {
    return this.props.customerId?.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
