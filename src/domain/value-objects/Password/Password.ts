import { Text } from '../Text/Text';
import { ValidationError } from '@/domain/common/errors';
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
    // Validate that value is a string
    const text = Text.create(value, { canBeEmpty: false });

    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Validate minimum length
    if (text.value.length < opts.minLength) {
      throw new ValidationError(
        `Password: value must be at least ${opts.minLength} characters long`,
      );
    }

    // Validate maximum length
    if (text.value.length > opts.maxLength) {
      throw new ValidationError(
        `Password: value must not exceed ${opts.maxLength} characters`,
      );
    }

    // Validate uppercase requirement
    if (opts.requireUppercase && !/[A-Z]/.test(text.value)) {
      throw new ValidationError(
        'Password: value must contain at least one uppercase letter',
      );
    }

    // Validate lowercase requirement
    if (opts.requireLowercase && !/[a-z]/.test(text.value)) {
      throw new ValidationError(
        'Password: value must contain at least one lowercase letter',
      );
    }

    // Validate number requirement
    if (opts.requireNumber && !/[0-9]/.test(text.value)) {
      throw new ValidationError(
        'Password: value must contain at least one number',
      );
    }

    // Validate special character requirement
    if (
      opts.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/;'`~]/.test(text.value)
    ) {
      throw new ValidationError(
        'Password: value must contain at least one special character',
      );
    }

    return new Password({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
