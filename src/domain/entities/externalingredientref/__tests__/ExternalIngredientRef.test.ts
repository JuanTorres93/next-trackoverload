import {
  ExternalIngredientRef,
  ExternalIngredientRefCreateProps,
} from '../ExternalIngredientRef';
import * as vp from '@/../tests/createProps';

describe('ExternalIngredientRef', () => {
  let externalIngredientRef: ExternalIngredientRef;
  let validExternalIngredientRefProps: ExternalIngredientRefCreateProps;

  beforeEach(() => {
    validExternalIngredientRefProps = {
      ...vp.validExternalIngredientRefProps,
    };
    externalIngredientRef = ExternalIngredientRef.create(
      validExternalIngredientRefProps
    );
  });

  describe('Creation', () => {
    it('should create a valid externalIngredientRef', () => {
      expect(externalIngredientRef).toBeInstanceOf(ExternalIngredientRef);
    });
  });
});
