import { Text } from '../Text/Text';
import { ValidationError } from '@/domain/common/errors';
import { ValueObject } from '../ValueObject';

type HashedPasswordProps = {
  value: string;
};

/**
 * Represents a hashed password in the domain.
 * This is a pure domain value object that doesn't know about hashing algorithms.
 * Hashing and comparison logic belongs to the infrastructure layer.
 */
export class HashedPassword extends ValueObject<HashedPasswordProps> {
  private readonly _value: string;

  private constructor(props: HashedPasswordProps) {
    super(props);
    this._value = props.value;
  }

  public static create(hashedValue: string): HashedPassword {
    const text = Text.create(hashedValue, { canBeEmpty: false });

    // Basic validation: a hash should be reasonably long
    if (text.value.length < 10) {
      throw new ValidationError(
        'HashedPassword: value appears to be too short to be a valid hash',
      );
    }

    return new HashedPassword({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
