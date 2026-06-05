import { ValidationDomainError } from '../../common/domainErrors';
import { Text } from '../Text/Text';
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
    const text = Text.create(value, { canBeEmpty: false });

    if (!this.EMAIL_REGEX.test(text.value)) {
      throw new ValidationDomainError('Email must be a valid email format');
    }

    const processedValue = text.value.toLowerCase();

    return new Email({ value: processedValue });
  }

  get value(): string {
    return this._value;
  }
}
