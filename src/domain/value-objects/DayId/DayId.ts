import { ValueObject } from '../ValueObject';
import { ValidationError } from '@/domain/common/errors';

type DayIdProps = {
  value: string;
};

export class DayId extends ValueObject<DayIdProps> {
  private readonly _value: string;

  private constructor(props: DayIdProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: Date) {
    if (!value) throw new ValidationError('DayId: value cannot be empty');

    if (!(value instanceof Date))
      throw new ValidationError('DayId: value must be a Date instance');

    // Extract YYYYMMDD format always in UTC to avoid timezone issues
    const year = value.getUTCFullYear();
    // Months are zero-indexed in JS Date
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    const formattedValue = `${year}${month}${day}`;

    return new DayId({ value: formattedValue });
  }

  get value(): string {
    return this._value;
  }
}
