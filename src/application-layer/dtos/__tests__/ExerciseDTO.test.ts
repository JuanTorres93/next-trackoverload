import { getGetters } from '../utils/getGetters';
import { toExerciseDTO, ExerciseDTO } from '../ExerciseDTO';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import * as vp from '@/../tests/createProps';

describe('ExerciseDTO', () => {
  let exercise: Exercise;
  let exerciseDTO: ExerciseDTO;

  beforeEach(() => {
    exercise = Exercise.create(vp.validExerciseProps);
  });

  describe('toExerciseDTO', () => {
    beforeEach(() => {
      exerciseDTO = toExerciseDTO(exercise);
    });

    it('should have a prop for each exercise getter', () => {
      const exerciseGetters: string[] = getGetters(exercise);

      for (const getter of exerciseGetters) {
        expect(exerciseDTO).toHaveProperty(getter);
      }
    });

    it('should convert Exercise to ExerciseDTO', () => {
      expect(exerciseDTO).toEqual({
        id: exercise.id,
        name: exercise.name,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof exerciseDTO.createdAt).toBe('string');
      expect(typeof exerciseDTO.updatedAt).toBe('string');
      expect(exerciseDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(exerciseDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
