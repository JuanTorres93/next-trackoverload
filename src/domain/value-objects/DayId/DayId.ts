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

export function stringDayIdToDate(dayId: string): Date {
  if (!/^\d{8}$/.test(dayId)) {
    throw new ValidationError(
      'stringDayIdToDate: dayId must be in YYYYMMDD format'
    );
  }

  const year = parseInt(dayId.slice(0, 4), 10);
  // month must be human readable
  const month = parseInt(dayId.slice(4, 6), 10) - 1; // Months are zero-indexed
  const day = parseInt(dayId.slice(6, 8), 10);

  return new Date(Date.UTC(year, month, day));
}
