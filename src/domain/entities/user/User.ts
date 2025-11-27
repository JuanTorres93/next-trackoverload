import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Id } from '@/domain/types/Id/Id';
import { validateNonEmptyString } from '../../common/validation';
import { ValidationError } from '@/domain/common/errors';

export type UserUpdateProps = {
  name?: string;
  customerId?: string;
};

export type UserProps = {
  id: Id;
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
    if (!(props.id instanceof Id))
      throw new ValidationError('User id must be an instance of Id');

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
    return this.props.id.value;
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
