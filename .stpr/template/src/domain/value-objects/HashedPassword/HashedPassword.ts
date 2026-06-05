import { ValidationDomainError } from '../../common/domainErrors';
import { Text } from '../Text/Text';
import { ValueObject } from '../ValueObject';

type HashedPasswordProps = {
  value: string;
};

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
      throw new ValidationDomainError('Not a valid hash');
    }

    return new HashedPassword({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
