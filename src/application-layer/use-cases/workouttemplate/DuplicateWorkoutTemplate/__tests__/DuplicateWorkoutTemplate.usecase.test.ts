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
      ...vp.validWorkoutTemplateProps(),
      name: 'Push Day',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: originalTemplate.id,
    };

    const result = await usecase.execute(request);

    expect(result.userId).toBe(vp.userId);
    expect(result.name).toBe('Push Day (Copy)');
    expect(result.id).not.toBe(originalTemplate.id);
    expect(result.createdAt).not.toEqual(originalTemplate.createdAt);
    expect(result.updatedAt).not.toEqual(originalTemplate.updatedAt);

    const originalExercisesIds = originalTemplate.exercises.map((e) => e.id);
    const resultExercisesIds = result.exercises.map((e) => e.id);
    expect(originalExercisesIds).toEqual(resultExercisesIds);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Push Day (Copy)');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      name: 'Leg Day',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps().id,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should duplicate workout template with custom name', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps().id,
      newTemplateName: 'Push Day CUSTOM',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('Push Day CUSTOM');
    expect(result.id).not.toBe(originalTemplate.id);

    const originalExercisesIds = originalTemplate.exercises.map((e) => e.id);
    const resultExercisesIds = result.exercises.map((e) => e.id);
    expect(originalExercisesIds).toEqual(resultExercisesIds);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Push Day CUSTOM');
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
      ...vp.validWorkoutTemplateProps(),
      name: 'Empty Template',
      exercises: [],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps().id,
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

  it('should throw NotFoundError when trying to duplicate deleted template', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    originalTemplate.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: vp.userId,
      originalTemplateId: vp.validWorkoutTemplateProps().id,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when trying to duplicate template from different user', async () => {
    const originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      userId: 'other-user',
      originalTemplateId: vp.validWorkoutTemplateProps().id,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
