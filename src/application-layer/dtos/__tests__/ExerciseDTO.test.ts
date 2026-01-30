import * as vp from '@/../tests/createProps';
import * as exerciseTestProps from '../../../../tests/createProps/exerciseTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ExerciseDTO, toExerciseDTO } from '../ExerciseDTO';

describe('ExerciseDTO', () => {
  let exercise: Exercise;
  let exerciseDTO: ExerciseDTO;

  beforeEach(() => {
    exercise = Exercise.create(exerciseTestProps.validExerciseProps);
  });

  describe('toExerciseDTO', () => {
    beforeEach(() => {
      exerciseDTO = toExerciseDTO(exercise);
    });

    it('should have a prop for each exercise getter', () => {
      for (const getter of dto.exerciseDTOProperties) {
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
