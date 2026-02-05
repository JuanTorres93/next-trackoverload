import { toWorkoutLineDTO, WorkoutLineDTO } from '../WorkoutLineDTO';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import * as workoutTestProps from '../../../../tests/createProps/workoutTestProps';
import * as dto from '@/../tests/dtoProperties';

describe('WorkoutLineDTO', () => {
  let workoutLine: WorkoutLine;
  let workoutLineDTO: WorkoutLineDTO;

  beforeEach(() => {
    workoutLine = WorkoutLine.create(workoutTestProps.validWorkoutLineProps);
  });

  describe('toWorkoutLineDTO', () => {
    beforeEach(() => {
      workoutLineDTO = toWorkoutLineDTO(workoutLine);
    });

    it('should have a prop for each workout line getter', () => {
      for (const prop of dto.workoutLineDTOProperties) {
        expect(workoutLineDTO).toHaveProperty(prop);
      }
    });

    it('should convert WorkoutLine to WorkoutLineDTO', () => {
      expect(workoutLineDTO).toEqual({
        id: workoutLine.id,
        workoutId: workoutLine.workoutId,
        exerciseId: workoutLine.exerciseId,
        setNumber: workoutLine.setNumber,
        reps: workoutLine.reps,
        weightInKg: workoutLine.weightInKg,
        createdAt: workoutLine.createdAt.toISOString(),
        updatedAt: workoutLine.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof workoutLineDTO.createdAt).toBe('string');
      expect(typeof workoutLineDTO.updatedAt).toBe('string');
      expect(workoutLineDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(workoutLineDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
