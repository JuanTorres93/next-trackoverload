import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type FloatProps = {
  value: number;
};

type FloatOptions = {
  onlyPositive?: boolean;
  canBeZero?: boolean;
};

export class Float extends ValueObject<FloatProps> {
  private readonly _value: number;

  private constructor(props: FloatProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: number, options?: FloatOptions) {
    if (typeof value !== 'number')
      throw new ValidationError('Float: value must be a number');

    if (options?.onlyPositive && value < 0) {
      throw new ValidationError('Float: value must be positive');
    }

    if (options?.canBeZero === false && value === 0) {
      throw new ValidationError('Float: value cannot be zero');
    }

    return new Float({ value });
  }

  get value(): number {
    return this._value;
  }
}
