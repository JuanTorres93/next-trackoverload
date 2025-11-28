import { Integer } from '../Integer/Integer';
import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type TextProps = {
  value: string;
};

type TextOptions = {
  maxLength?: Integer;
  canBeEmpty?: boolean;
};

export class Text extends ValueObject<TextProps> {
  private readonly _value: string;

  private constructor(props: TextProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string, options?: TextOptions) {
    if (typeof value !== 'string')
      throw new ValidationError('Text: value must be a string');

    if (options?.maxLength) {
      if (value.length > options.maxLength.value) {
        throw new ValidationError(
          `Text: value length must not exceed ${options.maxLength.value} characters`
        );
      }
    }

    if (options?.canBeEmpty === false && value.trim() === '') {
      throw new ValidationError('Text: value cannot be empty');
    }

    return new Text({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
