import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type IdProps = {
  value: string;
};

export class Id extends ValueObject<IdProps> {
  private readonly _value: string;

  private constructor(props: IdProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string) {
    if (!value) throw new ValidationError('Id: value cannot be empty');

    if (typeof value !== 'string')
      throw new ValidationError('Id: value must be a string');

    if (value.trim() === '')
      throw new ValidationError('Id: value cannot be empty');

    return new Id({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
