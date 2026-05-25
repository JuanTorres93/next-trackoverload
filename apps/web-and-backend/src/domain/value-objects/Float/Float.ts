import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { ValueObject } from "../ValueObject";

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
    if (value === null || value === undefined) {
      logNoTest("Float: value is required");
      throw new ValidationError("El valor es obligatorio.");
    }

    if (typeof value !== "number" || isNaN(value)) {
      logNoTest("Float: value must be a number");
      throw new ValidationError("El valor debe ser un número.");
    }

    if (options?.onlyPositive && value < 0) {
      logNoTest("Float: value must be positive");
      throw new ValidationError("El valor debe ser positivo.");
    }

    if (options?.canBeZero === false && value === 0) {
      logNoTest("Float: value cannot be zero");
      throw new ValidationError("El valor no puede ser cero.");
    }

    return new Float({ value });
  }

  get value(): number {
    return this._value;
  }
}
