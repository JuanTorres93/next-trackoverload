import { ValidationError } from '@/domain/common/errors';
import { Integer } from '../Integer/Integer';
import { ValueObject } from '../ValueObject';

type DayIdCreateProps = {
  day: number;
  month: number;
  year: number;
};

type DayIdProps = {
  value: string;
};

const dayIntegerOptions = {
  canBeZero: false,
  onlyPositive: true,
  min: 1,
  max: 31,
};

const monthIntegerOptions = {
  canBeZero: false,
  onlyPositive: true,
  min: 1,
  max: 12,
};

const yearIntegerOptions = {
  onlyPositive: true,
  min: 0,
};

export class DayId extends ValueObject<DayIdProps> {
  private readonly _value: string;

  private constructor(props: DayIdProps) {
    super(props);

    this._value = props.value;
  }

  public static create(props: DayIdCreateProps): DayId {
    if (!props || !props.day || !props.month || !props.year)
      throw new ValidationError('DayId: value cannot be empty');

    const day = Integer.create(props.day, dayIntegerOptions);
    const month = Integer.create(props.month, monthIntegerOptions);
    const year = Integer.create(props.year, yearIntegerOptions);

    // Format: YYYYMMDD
    const formattedValue = `${year.value
      .toString()
      .padStart(4, '0')}${month.value.toString().padStart(2, '0')}${day.value
      .toString()
      .padStart(2, '0')}`;

    return new DayId({ value: formattedValue });
  }

  get value(): string {
    return this._value;
  }

  get day(): number {
    return dayIdToDayMonthYear(this._value).day;
  }

  get month(): number {
    return dayIdToDayMonthYear(this._value).month;
  }

  get year(): number {
    return dayIdToDayMonthYear(this._value).year;
  }
}

export function dayIdToDayMonthYear(dayId: string): {
  day: number;
  month: number;
  year: number;
} {
  if (!/^\d{8}$/.test(dayId)) {
    throw new ValidationError(
      'stringToDayMonthYear: dayId must be in YYYYMMDD format'
    );
  }

  const year = parseInt(dayId.slice(0, 4), 10);
  const month = parseInt(dayId.slice(4, 6), 10);
  const day = parseInt(dayId.slice(6, 8), 10);

  return { day, month, year };
}
