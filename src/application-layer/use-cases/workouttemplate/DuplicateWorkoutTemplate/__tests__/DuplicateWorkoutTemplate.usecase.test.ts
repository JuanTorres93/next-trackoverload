import { beforeEach, describe, expect, it } from 'vitest';
import { DuplicateWorkoutTemplateUsecase } from '../DuplicateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('DuplicateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: DuplicateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new DuplicateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should duplicate workout template with default copy name', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 2 },
      ],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: '1',
    };

    const result = await usecase.execute(request);

    expect(result.userId).toBe(vp.userId);
    expect(result.name).toBe('Push Day (Copy)');
    expect(result.id).not.toBe(originalTemplate.id);
    expect(result.exercises).toEqual(originalTemplate.exercises);
    expect(result.createdAt).not.toEqual(originalTemplate.createdAt);
    expect(result.updatedAt).not.toEqual(originalTemplate.updatedAt);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Push Day (Copy)');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      name: 'Leg Day',
      exercises: [{ exerciseId: 'squat', sets: 4 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: '1',
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should duplicate workout template with custom name', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: '1',
      newTemplateName: 'Push Day Advanced',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('Push Day Advanced');
    expect(result.id).not.toBe(originalTemplate.id);
    expect(result.exercises).toEqual(originalTemplate.exercises);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Push Day Advanced');
  });

  it('should throw NotFoundError when original template does not exist', async () => {
    const request = {
      userId: vp.userId,
      originalTemplateId: 'non-existent',
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was saved
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should duplicate template with empty exercises', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      name: 'Empty Template',
      exercises: [],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps.id.value,
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('Empty Template (Copy)');
    expect(result.exercises).toEqual([]);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Empty Template (Copy)');
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const userId of invalidUserIds) {
      const request = { userId, originalTemplateId: '1' };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if originalTemplateId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const id of invalidIds) {
      const request = { userId: vp.userId, originalTemplateId: id };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if newTemplateName is invalid', async () => {
    const invalidNames = ['', '   ', null, 8, {}, [], true, false];

    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    for (const name of invalidNames) {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps.id,
        newTemplateName: name,
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw NotFoundError when trying to duplicate deleted template', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    originalTemplate.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps.id.value,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when trying to duplicate template from different user', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: 'other-user',
      originalTemplateId: vp.validWorkoutTemplateProps.id.value,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const userId of invalidUserIds) {
      const request = { userId, originalTemplateId: '1' };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });
});
