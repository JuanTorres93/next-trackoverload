import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Email } from '../../value-objects/Email/Email';
import { HashedPassword } from '../../value-objects/HashedPassword/HashedPassword';
import { Id } from '../../value-objects/Id/Id';

export type UserCreateProps = {
  id: string;
  email: string;
  hashedPassword: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserProps = {
  id: Id;
  email: Email;
  hashedPassword: HashedPassword;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserCreateProps): User {
    const entityProps: UserProps = {
      id: Id.create(props.id),
      email: Email.create(props.email),
      hashedPassword: HashedPassword.create(props.hashedPassword),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new User(entityProps);
  }

  toCreateProps(): UserCreateProps {
    return {
      id: this.id,
      email: this.email,
      hashedPassword: this.hashedPassword,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get email() {
    return this.props.email.value;
  }

  get hashedPassword() {
    return this.props.hashedPassword.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
