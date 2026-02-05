import {
  ExternalIngredientRef,
  ExternalIngredientRefCreateProps,
} from '../ExternalIngredientRef';
import * as externalIngredientRefTestProps from '../../../../../tests/createProps/externalIngredientRefTestProps';

describe('ExternalIngredientRef', () => {
  let externalIngredientRef: ExternalIngredientRef;
  let validExternalIngredientRefProps: ExternalIngredientRefCreateProps;

  beforeEach(() => {
    validExternalIngredientRefProps = {
      ...externalIngredientRefTestProps.validExternalIngredientRefProps,
    };
    externalIngredientRef = ExternalIngredientRef.create(
      validExternalIngredientRefProps,
    );
  });

  describe('Creation', () => {
    it('should create a valid externalIngredientRef', () => {
      expect(externalIngredientRef).toBeInstanceOf(ExternalIngredientRef);
    });

    it('should create externalIngredientRef if no createdAt date is provided', async () => {
      // eslint-disable-next-line
      const { createdAt, ...propsWithoutCreatedAt } =
        validExternalIngredientRefProps;

      const externalIngredientRefWithoutCreatedAt =
        ExternalIngredientRef.create(propsWithoutCreatedAt);

      expect(externalIngredientRefWithoutCreatedAt).toBeInstanceOf(
        ExternalIngredientRef,
      );

      const now = new Date();

      expect(
        externalIngredientRefWithoutCreatedAt.createdAt.getTime(),
      ).toBeLessThanOrEqual(now.getTime());
    });
  });
});
