import { ValidationError } from '@/domain/common/errors';
import { ExternalIngredientRefSource } from '../ExternalIngredientRefSource';

describe('ExternalIngredientRefSource', () => {
  it("should create a valid ExternalIngredientRefSource with 'openfoodfacts'", () => {
    const source = ExternalIngredientRefSource.create('openfoodfacts');
    expect(source).toBeInstanceOf(ExternalIngredientRefSource);
    expect(source.value).toBe('openfoodfacts');
  });

  it('should be case insensitive and trim spaces', () => {
    const source = ExternalIngredientRefSource.create('  OpenFoodFacts  ');
    expect(source).toBeInstanceOf(ExternalIngredientRefSource);
    expect(source.value).toBe('openfoodfacts');
  });

  it('should throw ValidationError for invalid source', () => {
    expect(() => ExternalIngredientRefSource.create('invalidsource')).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError for empty source', () => {
    expect(() => ExternalIngredientRefSource.create('   ')).toThrow(
      ValidationError
    );
  });
});
