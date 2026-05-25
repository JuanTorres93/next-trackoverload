import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { ValueObject } from "../ValueObject";

type IntegerProps = {
  value: number;
};

type IntegerOptions = {
  onlyPositive?: boolean;
  canBeZero?: boolean;
  min?: number;
  max?: number;
};

export class Integer extends ValueObject<IntegerProps> {
  private readonly _value: number;

  private constructor(props: IntegerProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: number, options?: IntegerOptions) {
    if (value === null || value === undefined) {
      logNoTest("Integer: value is required");
      throw new ValidationError("El valor es obligatorio.");
    }

    if (typeof value !== "number" || isNaN(value)) {
      logNoTest("Integer: value must be a number");
      throw new ValidationError("El valor debe ser un número.");
    }

    if (!Number.isInteger(value)) {
      logNoTest("Integer: value must be an integer");
      throw new ValidationError("El valor debe ser un número entero.");
    }

    if (options?.onlyPositive && value < 0) {
      logNoTest("Integer: value must be positive");
      throw new ValidationError("El valor debe ser positivo.");
    }

    if (options?.canBeZero === false && value === 0) {
      logNoTest("Integer: value cannot be zero");
      throw new ValidationError("El valor no puede ser cero.");
    }

    if (options?.min !== undefined && value < options.min) {
      logNoTest(
        `Integer: value must be greater than or equal to ${options.min}`,
      );
      throw new ValidationError(
        `El valor debe ser mayor o igual a ${options.min}.`,
      );
    }

    if (options?.max !== undefined && value > options.max) {
      logNoTest(`Integer: value must be less than or equal to ${options.max}`);
      throw new ValidationError(
        `El valor debe ser menor o igual a ${options.max}.`,
      );
    }

    return new Integer({ value });
  }

  get value(): number {
    return this._value;
  }
}
