import { logNoTest } from "@/domain/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { ValueObject } from "../ValueObject";

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
    if (!value) {
      logNoTest("Id: value cannot be empty");
      throw new ValidationError("El identificador no puede estar vacío.");
    }

    if (typeof value !== "string") {
      logNoTest("Id: value must be a string");
      throw new ValidationError(
        "El identificador debe ser una cadena de texto.",
      );
    }

    if (value.trim() === "") {
      logNoTest("Id: value cannot be empty");
      throw new ValidationError("El identificador no puede estar vacío.");
    }

    return new Id({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
