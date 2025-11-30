import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type IntegerProps = {
  value: number;
};

type IntegerOptions = {
  onlyPositive?: boolean;
  canBeZero?: boolean;
};

export class Integer extends ValueObject<IntegerProps> {
  private readonly _value: number;

  private constructor(props: IntegerProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: number, options?: IntegerOptions) {
    if (value === null || value === undefined)
      throw new ValidationError('Integer: value is required');

    if (typeof value !== 'number' || isNaN(value))
      throw new ValidationError('Integer: value must be a number');

    if (!Number.isInteger(value))
      throw new ValidationError('Integer: value must be an integer');

    if (options?.onlyPositive && value < 0) {
      throw new ValidationError('Integer: value must be positive');
    }

    if (options?.canBeZero === false && value === 0) {
      throw new ValidationError('Integer: value cannot be zero');
    }

    return new Integer({ value });
  }

  get value(): number {
    return this._value;
  }
}
