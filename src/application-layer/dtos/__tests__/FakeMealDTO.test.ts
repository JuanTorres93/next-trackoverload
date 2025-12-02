import { getGetters } from '../utils/getGetters';
import { toFakeMealDTO, FakeMealDTO } from '../FakeMealDTO';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as vp from '@/../tests/createProps';

describe('FakeMealDTO', () => {
  let fakeMeal: FakeMeal;
  let fakeMealDTO: FakeMealDTO;

  beforeEach(() => {
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);
  });

  describe('toFakeMealDTO', () => {
    beforeEach(() => {
      fakeMealDTO = toFakeMealDTO(fakeMeal);
    });

    it('should have a prop for each fake meal getter', () => {
      const fakeMealGetters: string[] = getGetters(fakeMeal);

      for (const getter of fakeMealGetters) {
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
});
