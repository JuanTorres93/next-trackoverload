import { ValidationError } from "@/domain/common/errors";

import { Text } from "../Text/Text";
import { ValueObject } from "../ValueObject";

type ExternalExerciseRefSourceProps = {
  value: string;
};

export const VALID_SOURCES = ["wger", "backend-for-frontend"];

export class ExternalExerciseRefSource extends ValueObject<ExternalExerciseRefSourceProps> {
  private readonly _value: string;

  private constructor(props: ExternalExerciseRefSourceProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string): ExternalExerciseRefSource {
    // Validate text
    const text = Text.create(value, { canBeEmpty: false });

    // Validate source
    const source = Text.create(text.value.toLocaleLowerCase());
    if (!VALID_SOURCES.includes(source.value)) {
      throw new ValidationError(
        `ExternalExerciseRefSource: value must be one of [${VALID_SOURCES.join(
          ", ",
        )}]`,
      );
    }

    return new ExternalExerciseRefSource({
      value: source.value,
    });
  }

  get value(): string {
    return this._value;
  }
}
