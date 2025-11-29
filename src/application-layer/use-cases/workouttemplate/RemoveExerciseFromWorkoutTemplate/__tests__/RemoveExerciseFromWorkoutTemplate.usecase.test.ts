import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveExerciseFromWorkoutTemplateUsecase } from '../RemoveExerciseFromWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('RemoveExerciseFromWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: RemoveExerciseFromWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new RemoveExerciseFromWorkoutTemplateUsecase(
      workoutTemplatesRepo
    );
  });

  it('should remove exercise from workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'bench-press',
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(1);
    expect(result.exercises[0]).toEqual({
      exerciseId: 'shoulder-press',
      sets: 3,
    });

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(1);
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'bench-press',
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      userId: vp.userId,
      exerciseId: 'bench-press',
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should handle removing non-existent exercise gracefully', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'non-existent-exercise',
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(1);
    expect(result.exercises[0]).toEqual({
      exerciseId: 'bench-press',
      sets: 3,
    });

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(1);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const userId of invalidIds) {
      const request = {
        userId,
        workoutTemplateId: 'some-template',
        exerciseId: 'some-exercise',
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if workoutTemplateId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const workoutTemplateId of invalidIds) {
      const request = {
        workoutTemplateId,
        exerciseId: 'some-exercise',
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if exerciseId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const exerciseId of invalidIds) {
      const request = {
        workoutTemplateId: 'valid-id',
        exerciseId,
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if template is deleted', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'bench-press',
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
