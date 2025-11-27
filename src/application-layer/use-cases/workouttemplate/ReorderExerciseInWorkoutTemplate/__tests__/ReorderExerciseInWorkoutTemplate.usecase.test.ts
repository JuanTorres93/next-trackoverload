import { beforeEach, describe, expect, it } from 'vitest';
import { ReorderExerciseInWorkoutTemplateUsecase } from '../ReorderExerciseInWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('ReorderExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: ReorderExerciseInWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new ReorderExerciseInWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should reorder exercise in workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
        { exerciseId: 'tricep-dips', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps.id.value,
      exerciseId: 'tricep-dips',
      userId: vp.userId,
      newIndex: 0,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(3);
    expect(result.exercises[0].exerciseId).toBe('tricep-dips');
    expect(result.exercises[1].exerciseId).toBe('bench-press');
    expect(result.exercises[2].exerciseId).toBe('shoulder-press');

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises[0].exerciseId).toBe('tricep-dips');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
        { exerciseId: 'tricep-dips', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps.id.value,
      exerciseId: 'tricep-dips',
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
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
        { exerciseId: 'tricep-dips', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps.id.value,
      exerciseId: 'bench-press',
      newIndex: 1,
      userId: vp.userId,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(3);
    expect(result.exercises[0].exerciseId).toBe('shoulder-press');
    expect(result.exercises[1].exerciseId).toBe('bench-press');
    expect(result.exercises[2].exerciseId).toBe('tricep-dips');
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      exerciseId: 'bench-press',
      userId: vp.userId,
      newIndex: 0,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should handle reordering non-existent exercise gracefully', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps.id.value,
      exerciseId: 'non-existent-exercise',
      newIndex: 0,
      userId: vp.userId,
    };

    const result = await usecase.execute(request);

    // Should not change existing exercises when trying to reorder non-existent one
    expect(result.exercises).toHaveLength(2);
    expect(result.exercises[0].exerciseId).toBe('bench-press');
    expect(result.exercises[1].exerciseId).toBe('shoulder-press');

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(2);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        userId: invalidId as string,
        workoutTemplateId: 'valid-id',
        exerciseId: 'bench-press',
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow();
    }

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should throw error if workoutTemplateId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        workoutTemplateId: invalidId as string,
        exerciseId: 'bench-press',
        newIndex: 0,
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow();
    }

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should throw error if exerciseId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        userId: vp.userId,
        workoutTemplateId: 'valid-id',
        exerciseId: invalidId as string,
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow();
    }

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should throw error if newIndex is invalid', async () => {
    const invalidIndexes = [
      null,
      undefined,
      -1,
      1.5,
      'string',
      {},
      [],
      true,
      false,
    ];

    for (const invalidIndex of invalidIndexes) {
      const request = {
        workoutTemplateId: 'valid-id',
        exerciseId: 'bench-press',
        newIndex: invalidIndex as number,
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow();
    }

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should throw error if template is deleted', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
        { exerciseId: 'tricep-dips', sets: 3 },
      ],
    });

    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps.id.value,
      userId: vp.userId,
      exerciseId: 'tricep-dips',
      newIndex: 0,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
