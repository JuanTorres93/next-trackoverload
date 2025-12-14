import { Text } from '../Text/Text';
import { ValidationError } from '@/domain/common/errors';
import { ValueObject } from '../ValueObject';

type EmailProps = {
  value: string;
};

export class Email extends ValueObject<EmailProps> {
  private readonly _value: string;
  private static readonly EMAIL_REGEX =
    /^(?!.*\.\.)(?!\.)[A-Za-z0-9._%+-]+(?<!\.)@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/;

  private constructor(props: EmailProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string): Email {
    // Validate text
    const text = Text.create(value, { canBeEmpty: false });

    // Validate email format
    if (!this.EMAIL_REGEX.test(text.value)) {
      throw new ValidationError('Email: value must be a valid email format');
    }

    return new Email({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
