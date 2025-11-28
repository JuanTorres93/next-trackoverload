import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Id } from '@/domain/value-objects/Id/Id';
import { validateNonEmptyString } from '../../common/validation';
import { ValidationError } from '@/domain/common/errors';

export type UserUpdateProps = {
  name?: string;
  customerId?: Id;
};

export type UserProps = {
  id: Id;
  name: string;
  customerId?: Id;
  createdAt: Date;
  updatedAt: Date;
};

function validateUpdateProps(patch: UserUpdateProps) {
  if (patch.name !== undefined) {
    validateNonEmptyString(patch.name, 'User name');
  }
  if (patch.customerId !== undefined && !(patch.customerId instanceof Id)) {
    throw new ValidationError('User customerId must be an instance of Id');
  }
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    if (!(props.id instanceof Id))
      throw new ValidationError('User id must be an instance of Id');

    validateNonEmptyString(props.name, 'User name');

    if (props.customerId !== undefined && !(props.customerId instanceof Id))
      throw new ValidationError('User customerId must be an instance of Id');

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
    return this.props.customerId?.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
