import { ValidationDomainError } from '../../common/domainErrors';
import { Text } from '../Text/Text';
import { ValueObject } from '../ValueObject';

type PasswordProps = {
  value: string;
};

export type PasswordOptions = {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
};

const DEFAULT_OPTIONS: Required<PasswordOptions> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// IMPORTANT: Use for validation, not for storage
export class Password extends ValueObject<PasswordProps> {
  private readonly _value: string;

  private constructor(props: PasswordProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string, options?: PasswordOptions): Password {
    const text = Text.create(value, { canBeEmpty: false });

    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (text.value.length < opts.minLength) {
      throw new ValidationDomainError(
        `Password must be at least ${opts.minLength} characters long`,
      );
    }

    if (text.value.length > opts.maxLength) {
      throw new ValidationDomainError(
        `Password must be less than ${opts.maxLength} characters long`,
      );
    }

    if (opts.requireUppercase && !/[A-Z]/.test(text.value)) {
      throw new ValidationDomainError(
        'Password must contain at least one uppercase letter',
      );
    }

    if (opts.requireLowercase && !/[a-z]/.test(text.value)) {
      throw new ValidationDomainError(
        'Password must contain at least one lowercase letter',
      );
    }

    if (opts.requireNumber && !/[0-9]/.test(text.value)) {
      throw new ValidationDomainError(
        'Password must contain at least one number',
      );
    }

    if (
      opts.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/;'`~]/.test(text.value)
    ) {
      throw new ValidationDomainError(
        'Password must contain at least one special character',
      );
    }

    return new Password({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
