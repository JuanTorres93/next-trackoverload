import { ValidationError } from "../../common/errors";
import { Text } from "../Text/Text";
import { ValueObject } from "../ValueObject";

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
        `La contraseña debe tener al menos ${opts.minLength} caracteres`,
      );
    }

    // Validate maximum length
    if (text.value.length > opts.maxLength) {
      throw new ValidationError(
        `La contraseña debe ser menor de ${opts.maxLength} caracteres`,
      );
    }

    // Validate uppercase requirement
    if (opts.requireUppercase && !/[A-Z]/.test(text.value)) {
      throw new ValidationError(
        "La contraseña debe contener al menos una letra mayúscula",
      );
    }

    // Validate lowercase requirement
    if (opts.requireLowercase && !/[a-z]/.test(text.value)) {
      throw new ValidationError(
        "La contraseña debe contener al menos una letra minúscula",
      );
    }

    // Validate number requirement
    if (opts.requireNumber && !/[0-9]/.test(text.value)) {
      throw new ValidationError(
        "La contraseña debe contener al menos un número",
      );
    }

    // Validate special character requirement
    if (
      opts.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/;'`~]/.test(text.value)
    ) {
      throw new ValidationError(
        "La contraseña debe contener al menos un carácter especial",
      );
    }

    return new Password({ value: text.value });
  }

  get value(): string {
    return this._value;
  }
}
