import { getGetters } from './_getGettersUtil';
import {
  toWorkoutTemplateLineDTO,
  WorkoutTemplateLineDTO,
} from '../WorkoutTemplateLineDTO';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import * as vp from '@/../tests/createProps';

describe('WorkoutTemplateLineDTO', () => {
  let workoutTemplateLine: WorkoutTemplateLine;
  let workoutTemplateLineDTO: WorkoutTemplateLineDTO;

  beforeEach(() => {
    workoutTemplateLine = WorkoutTemplateLine.create(
      vp.validWorkoutTemplateLineProps
    );
  });

  describe('toWorkoutTemplateLineDTO', () => {
    beforeEach(() => {
      workoutTemplateLineDTO = toWorkoutTemplateLineDTO(workoutTemplateLine);
    });

    it('should have a prop for each workout template line getter', () => {
      const templateLineGetters: string[] = getGetters(workoutTemplateLine);

      for (const getter of templateLineGetters) {
        expect(workoutTemplateLineDTO).toHaveProperty(getter);
      }
    });

    it('should convert WorkoutTemplateLine to WorkoutTemplateLineDTO', () => {
      expect(workoutTemplateLineDTO).toEqual({
        id: workoutTemplateLine.id,
        exerciseId: workoutTemplateLine.exerciseId,
        sets: workoutTemplateLine.sets,
        createdAt: workoutTemplateLine.createdAt.toISOString(),
        updatedAt: workoutTemplateLine.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof workoutTemplateLineDTO.createdAt).toBe('string');
      expect(typeof workoutTemplateLineDTO.updatedAt).toBe('string');
      expect(workoutTemplateLineDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(workoutTemplateLineDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
