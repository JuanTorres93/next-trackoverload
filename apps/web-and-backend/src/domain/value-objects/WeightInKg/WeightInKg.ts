import { Float } from '../Float/Float';
import { ValueObject } from '../ValueObject';

type WeightInKgProps = {
  value: number;
};

export class WeightInKg extends ValueObject<WeightInKgProps> {
  private readonly _value: number;

  private constructor(props: WeightInKgProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: number): WeightInKg {
    const floatValue = Float.create(value, { onlyPositive: true });

    return new WeightInKg({ value: floatValue.value });
  }

  get value(): number {
    return this._value;
  }
}