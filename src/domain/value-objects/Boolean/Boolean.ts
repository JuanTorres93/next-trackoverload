import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type BooleanProps = {
  value: boolean;
};

export class Bool extends ValueObject<BooleanProps> {
  private readonly _value: boolean;

  private constructor(props: BooleanProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: boolean): Bool {
    if (value === null || value === undefined)
      throw new ValidationError('Bool: value is required');

    if (typeof value !== 'boolean')
      throw new ValidationError('Bool: value must be a boolean');

    return new Bool({ value });
  }

  get value(): boolean {
    return this._value;
  }
}
