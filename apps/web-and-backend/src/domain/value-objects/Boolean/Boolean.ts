import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { ValueObject } from "../ValueObject";

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
    if (value === null || value === undefined) {
      logNoTest("Bool: value is required");
      throw new ValidationError("El valor es obligatorio.");
    }

    if (typeof value !== "boolean") {
      logNoTest("Bool: value must be a boolean");
      throw new ValidationError("El valor debe ser un booleano.");
    }

    return new Bool({ value });
  }

  get value(): boolean {
    return this._value;
  }
}
