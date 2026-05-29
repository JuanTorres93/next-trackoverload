import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { Text } from "../Text/Text";
import { ValueObject } from "../ValueObject";

type ExternalIngredientRefSourceProps = {
  value: string;
};

export const VALID_SOURCES = ["openfoodfacts"];

export class ExternalIngredientRefSource extends ValueObject<ExternalIngredientRefSourceProps> {
  private readonly _value: string;

  private constructor(props: ExternalIngredientRefSourceProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string): ExternalIngredientRefSource {
    // Validate text
    const text = Text.create(value, { canBeEmpty: false });
    const source = Text.create(text.value.toLocaleLowerCase());

    // Validate source
    if (!VALID_SOURCES.includes(source.value)) {
      logNoTest(
        `ExternalIngredientRefSource: value must be one of [${VALID_SOURCES.join(", ")}]`,
      );
      throw new ValidationError("La fuente del ingrediente no es válida.");
    }

    return new ExternalIngredientRefSource({
      value: source.value,
    });
  }

  get value(): string {
    return this._value;
  }
}
