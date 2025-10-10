import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { validateNonEmptyString } from '../../common/validation';

export type UserUpdateProps = {
  name?: string;
  customerId?: string;
};

export type UserProps = {
  id: string;
  name: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

function validateUpdateProps(patch: UserUpdateProps) {
  if (patch.name !== undefined) {
    validateNonEmptyString(patch.name, 'User name');
  }
  if (patch.customerId !== undefined) {
    validateNonEmptyString(patch.customerId, 'User customerId');
  }
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    validateNonEmptyString(props.id, 'User id');
    validateNonEmptyString(props.name, 'User name');
    if (props.customerId !== undefined)
      validateNonEmptyString(props.customerId, 'User customerId');

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new User(props);
  }

  update(patch: UserUpdateProps): void {
    validateUpdateProps(patch);

    if (patch.name) {
      this.props.name = patch.name;
    }

    if (patch.customerId) {
      this.props.customerId = patch.customerId;
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
