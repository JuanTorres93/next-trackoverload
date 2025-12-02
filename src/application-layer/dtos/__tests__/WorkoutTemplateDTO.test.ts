import { getGetters } from '../utils/getGetters';
import {
  toWorkoutTemplateDTO,
  WorkoutTemplateDTO,
} from '../WorkoutTemplateDTO';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import * as vp from '@/../tests/createProps';

describe('WorkoutTemplateDTO', () => {
  let workoutTemplate: WorkoutTemplate;
  let templateLine: WorkoutTemplateLine;
  let workoutTemplateDTO: WorkoutTemplateDTO;

  beforeEach(() => {
    const validProps = vp.validWorkoutTemplateProps();
    templateLine = validProps.exercises[0];
    workoutTemplate = WorkoutTemplate.create(validProps);
  });

  describe('toWorkoutTemplateDTO', () => {
    beforeEach(() => {
      workoutTemplateDTO = toWorkoutTemplateDTO(workoutTemplate);
    });

    it('should have a prop for each workout template getter', () => {
      const workoutTemplateGetters: string[] = getGetters(workoutTemplate);

      for (const getter of workoutTemplateGetters) {
        expect(workoutTemplateDTO).toHaveProperty(getter);
      }
    });

    it('should convert WorkoutTemplate to WorkoutTemplateDTO', () => {
      expect(workoutTemplateDTO).toEqual({
        id: workoutTemplate.id,
        userId: workoutTemplate.userId,
        name: workoutTemplate.name,
        exercises: workoutTemplate.exercises.map((line) => ({
          id: line.id,
          exerciseId: line.exerciseId,
          sets: line.sets,
          createdAt: line.createdAt.toISOString(),
          updatedAt: line.updatedAt.toISOString(),
        })),
        createdAt: workoutTemplate.createdAt.toISOString(),
        updatedAt: workoutTemplate.updatedAt.toISOString(),
        deletedAt: workoutTemplate.deletedAt?.toISOString(),
        isDeleted: workoutTemplate.isDeleted,
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof workoutTemplateDTO.createdAt).toBe('string');
      expect(typeof workoutTemplateDTO.updatedAt).toBe('string');
      expect(workoutTemplateDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(workoutTemplateDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include nested template line DTOs', () => {
      expect(workoutTemplateDTO.exercises).toHaveLength(2);
      const templateLineDTO = workoutTemplateDTO.exercises[0];

      const templateLineGetters = getGetters(templateLine);
      for (const getter of templateLineGetters) {
        expect(templateLineDTO).toHaveProperty(getter);
      }
    });

    it('should handle optional deletedAt', () => {
      const workoutTemplateWithDeletedAt = WorkoutTemplate.create({
        ...vp.validWorkoutTemplateProps(),
        deletedAt: new Date('2023-12-01'),
      });

      const dto = toWorkoutTemplateDTO(workoutTemplateWithDeletedAt);
      expect(dto.deletedAt).toBe(
        workoutTemplateWithDeletedAt.deletedAt?.toISOString()
      );
    });

    it('should handle undefined deletedAt', () => {
      expect(workoutTemplateDTO.deletedAt).toBeUndefined();
    });
  });
});
