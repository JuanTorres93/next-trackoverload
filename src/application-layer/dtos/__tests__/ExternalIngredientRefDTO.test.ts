import * as externalIngredientRefTestProps from '../../../../tests/createProps/externalIngredientRefTestProps';
import * as dto from '@/../tests/dtoProperties';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import {
  fromExternalIngredientRefDTO,
  ExternalIngredientRefDTO,
  toExternalIngredientRefDTO,
} from '../ExternalIngredientRefDTO';

describe('ExternalIngredientRefDTO', () => {
  let externalIngredientRef: ExternalIngredientRef;
  let externalIngredientRefDTO: ExternalIngredientRefDTO;

  beforeEach(() => {
    externalIngredientRef = ExternalIngredientRef.create(
      externalIngredientRefTestProps.validExternalIngredientRefProps,
    );
  });

  describe('toExternalIngredientRefDTO', () => {
    beforeEach(() => {
      externalIngredientRefDTO = toExternalIngredientRefDTO(
        externalIngredientRef,
      );
    });

    it('should have a prop for each external ingredient ref getter', () => {
      expect(externalIngredientRefDTO).not.toBeInstanceOf(
        ExternalIngredientRef,
      );

      for (const getter of dto.externalIngredientRefDTOProperties) {
        expect(externalIngredientRefDTO).toHaveProperty(getter);
      }
    });

    it('should convert ExternalIngredientRef to ExternalIngredientRefDTO', () => {
      expect(externalIngredientRefDTO).toEqual({
        externalId: externalIngredientRef.externalId,
        source: externalIngredientRef.source,
        ingredientId: externalIngredientRef.ingredientId,
        createdAt: externalIngredientRef.createdAt.toISOString(),
      });
    });
  });

  describe('fromExternalIngredientRefDTO', () => {
    let recreatedRef: ExternalIngredientRef;

    beforeEach(() => {
      externalIngredientRefDTO = toExternalIngredientRefDTO(
        externalIngredientRef,
      );
      recreatedRef = fromExternalIngredientRefDTO(externalIngredientRefDTO);
    });

    it('should convert ExternalIngredientRefDTO back to ExternalIngredientRef', () => {
      expect(recreatedRef).toBeInstanceOf(ExternalIngredientRef);
    });

    it('should preserve all properties when converting DTO to entity', () => {
      expect(recreatedRef.externalId).toBe(externalIngredientRef.externalId);
      expect(recreatedRef.source).toBe(externalIngredientRef.source);
      expect(recreatedRef.ingredientId).toBe(
        externalIngredientRef.ingredientId,
      );
    });

    it('should preserve date when converting DTO to entity', () => {
      expect(recreatedRef.createdAt.getTime()).toBe(
        externalIngredientRef.createdAt.getTime(),
      );
    });

    it('should be bidirectional (entity -> DTO -> entity)', () => {
      const dto = toExternalIngredientRefDTO(externalIngredientRef);
      const recreated = fromExternalIngredientRefDTO(dto);

      expect(recreated.externalId).toBe(externalIngredientRef.externalId);
      expect(recreated.source).toBe(externalIngredientRef.source);
      expect(recreated.ingredientId).toBe(externalIngredientRef.ingredientId);
      expect(recreated.createdAt.getTime()).toBe(
        externalIngredientRef.createdAt.getTime(),
      );
    });
  });
});
