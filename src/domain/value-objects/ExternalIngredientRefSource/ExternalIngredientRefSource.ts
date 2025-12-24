import { Text } from '../Text/Text';
import { ValidationError } from '@/domain/common/errors';
import { ValueObject } from '../ValueObject';

type ExternalIngredientRefSourceProps = {
  value: string;
};

const VALID_SOURCES = ['openfoodfacts'];

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
      throw new ValidationError(
        `ExternalIngredientRefSource: value must be one of [${VALID_SOURCES.join(
          ', '
        )}]`
      );
    }

    return new ExternalIngredientRefSource({
      value: source.value,
    });
  }

  get value(): string {
    return this._value;
  }
}
