import * as fakeMealTestProps from '../../../../tests/createProps/fakeMealTestProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { FakeMealDTO, fromFakeMealDTO, toFakeMealDTO } from '../FakeMealDTO';

describe('FakeMealDTO', () => {
  let fakeMeal: FakeMeal;
  let fakeMealDTO: FakeMealDTO;

  beforeEach(() => {
    fakeMeal = fakeMealTestProps.createTestFakeMeal();
  });

  describe('toFakeMealDTO', () => {
    beforeEach(() => {
      fakeMealDTO = toFakeMealDTO(fakeMeal);
    });

    it('should have a prop for each fake meal getter', () => {
      for (const getter of dto.fakeMealDTOProperties) {
        expect(fakeMealDTO).toHaveProperty(getter);
      }
    });

    it('should convert FakeMeal to FakeMealDTO', () => {
      expect(fakeMealDTO).toEqual({
        id: fakeMeal.id,
        userId: fakeMeal.userId,
        name: fakeMeal.name,
        calories: fakeMeal.calories,
        protein: fakeMeal.protein,
        createdAt: fakeMeal.createdAt.toISOString(),
        updatedAt: fakeMeal.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof fakeMealDTO.createdAt).toBe('string');
      expect(typeof fakeMealDTO.updatedAt).toBe('string');
      expect(fakeMealDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(fakeMealDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('fromFakeMealDTO', () => {
    beforeEach(() => {
      fakeMealDTO = toFakeMealDTO(fakeMeal);
    });

    it('should convert FakeMealDTO to FakeMeal', () => {
      const reconstructedFakeMeal = fromFakeMealDTO(fakeMealDTO);

      expect(reconstructedFakeMeal).toBeInstanceOf(FakeMeal);
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedFakeMeal = fromFakeMealDTO(fakeMealDTO);
      const reconvertedDTO = toFakeMealDTO(reconstructedFakeMeal);

      expect(reconvertedDTO).toEqual(fakeMealDTO);
    });

    it('should convert ISO date strings to Date objects', () => {
      const reconstructedFakeMeal = fromFakeMealDTO(fakeMealDTO);

      expect(reconstructedFakeMeal.createdAt).toBeInstanceOf(Date);
      expect(reconstructedFakeMeal.updatedAt).toBeInstanceOf(Date);
      expect(reconstructedFakeMeal.createdAt.toISOString()).toBe(
        fakeMeal.createdAt.toISOString(),
      );
      expect(reconstructedFakeMeal.updatedAt.toISOString()).toBe(
        fakeMeal.updatedAt.toISOString(),
      );
    });
  });
});
