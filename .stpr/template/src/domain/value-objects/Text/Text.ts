import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

type TextProps = {
  value: string;
};

export type TextOptions = {
  maxLength?: number;
  canBeEmpty?: boolean;
};

export class Text extends ValueObject<TextProps> {
  private readonly _value: string;

  private constructor(props: TextProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string, options?: TextOptions) {
    if (typeof value !== 'string' || value === null || value === undefined)
      throw new ValidationDomainError('Text must be a string');

    if (options?.maxLength) {
      if (value.length > options.maxLength) {
        throw new ValidationDomainError(
          `Text: value length must not exceed ${options.maxLength} characters`,
        );
      }
    }

    if (options?.canBeEmpty === false && value.trim() === '') {
      throw new ValidationDomainError('Text cannot be empty');
    }

    return new Text({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
