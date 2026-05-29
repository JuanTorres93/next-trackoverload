import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { Integer } from "../Integer/Integer";
import { ValueObject } from "../ValueObject";

type TextProps = {
  value: string;
};

type TextOptions = {
  maxLength?: Integer;
  canBeEmpty?: boolean;
};

export class Text extends ValueObject<TextProps> {
  private readonly _value: string;

  private constructor(props: TextProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string, options?: TextOptions) {
    if (typeof value !== "string" || value === null || value === undefined) {
      logNoTest("Text: value must be a string");
      throw new ValidationError("El valor debe ser una cadena de texto.");
    }

    if (options?.maxLength) {
      if (value.length > options.maxLength.value) {
        logNoTest(
          `Text: value length must not exceed ${options.maxLength.value} characters`,
        );
        throw new ValidationError(
          `El texto no puede superar los ${options.maxLength.value} caracteres.`,
        );
      }
    }

    if (options?.canBeEmpty === false && value.trim() === "") {
      logNoTest("Text: value cannot be empty");
      throw new ValidationError("El texto no puede estar vacío.");
    }

    return new Text({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
