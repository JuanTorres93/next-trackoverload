import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

type DomainDateProps = {
  value: Date;
};

export class DomainDate extends ValueObject<DomainDateProps> {
  private readonly _value: Date;

  private constructor(props: DomainDateProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value?: Date): DomainDate {
    const now = new Date();

    if (value) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new ValidationDomainError(`Must be a valid date`);
      }

      return new DomainDate({ value });
    }

    return new DomainDate({ value: now });
  }

  get value(): Date {
    return this._value;
  }
}
