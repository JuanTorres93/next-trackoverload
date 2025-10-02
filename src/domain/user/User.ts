import { handleCreatedAt, handleUpdatedAt } from '../common/utils';
import { validateNonEmptyString } from '../common/validation';

type UserUpdateProps = {
  name?: string;
};

export type UserProps = {
  id: string;
  name: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    validateNonEmptyString(props.id, 'User id');
    validateNonEmptyString(props.name, 'User name');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new User(props);
  }

  update(patch: UserUpdateProps): void {
    if (patch.name) {
      this.props.name = patch.name;
    }

    this.props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get customerId() {
    return this.props.customerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
