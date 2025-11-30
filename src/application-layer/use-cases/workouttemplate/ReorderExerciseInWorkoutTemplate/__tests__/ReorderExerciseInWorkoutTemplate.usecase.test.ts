import { beforeEach, describe, expect, it } from 'vitest';
import { ReorderExerciseInWorkoutTemplateUsecase } from '../ReorderExerciseInWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

describe('ReorderExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: ReorderExerciseInWorkoutTemplateUsecase;
  let testTemplate: WorkoutTemplate;
  let additionalWorkoutTemplateLine: WorkoutTemplateLine;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new ReorderExerciseInWorkoutTemplateUsecase(workoutTemplatesRepo);

    testTemplate = WorkoutTemplate.create(vp.validWorkoutTemplateProps());
    additionalWorkoutTemplateLine = WorkoutTemplateLine.create({
      ...vp.validWorkoutTemplateLineProps,
      id: 'line3',
      exerciseId: 'ex3',
      sets: 3,
    });
  });

  it('should reorder exercise in workout template', async () => {
    const existingTemplate = testTemplate;
    testTemplate.addExercise(additionalWorkoutTemplateLine);

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'ex3',
      userId: vp.userId,
      newIndex: 0,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(3);
    expect(result.exercises[0].exerciseId).toBe('ex3');
    expect(result.exercises[1].exerciseId).toBe('ex1');
    expect(result.exercises[2].exerciseId).toBe('ex2');

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises[0].exerciseId).toBe('ex3');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = testTemplate;
    testTemplate.addExercise(additionalWorkoutTemplateLine);

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'ex3',
      newIndex: 0,
      userId: vp.userId,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should reorder exercise to middle position', async () => {
    const existingTemplate = testTemplate;
    testTemplate.addExercise(additionalWorkoutTemplateLine);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'ex1',
      newIndex: 1,
      userId: vp.userId,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(3);
    expect(result.exercises[0].exerciseId).toBe('ex2');
    expect(result.exercises[1].exerciseId).toBe('ex1');
    expect(result.exercises[2].exerciseId).toBe('ex3');
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      exerciseId: 'ex1',
      userId: vp.userId,
      newIndex: 0,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should handle reordering non-existent exercise gracefully', async () => {
    const existingTemplate = testTemplate;
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'non-existent-exercise',
      newIndex: 0,
      userId: vp.userId,
    };

    const result = await usecase.execute(request);

    // Should not change existing exercises when trying to reorder non-existent one
    expect(result.exercises).toHaveLength(2);
    expect(result.exercises[0].exerciseId).toBe('ex1');
    expect(result.exercises[1].exerciseId).toBe('ex2');

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(2);
  });

  it('should throw error if template is deleted', async () => {
    const existingTemplate = testTemplate;
    testTemplate.addExercise(additionalWorkoutTemplateLine);
    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'ex3',
      newIndex: 0,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
