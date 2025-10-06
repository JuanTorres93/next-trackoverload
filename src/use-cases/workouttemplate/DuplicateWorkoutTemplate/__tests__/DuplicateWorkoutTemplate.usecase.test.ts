import { beforeEach, describe, expect, it } from 'vitest';
import { DuplicateWorkoutTemplateUsecase } from '../DuplicateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';

describe('DuplicateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: DuplicateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new DuplicateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should duplicate workout template with default copy name', async () => {
    const originalTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 2 },
      ],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      originalTemplateId: '1',
    };

    const result = await usecase.execute(request);

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

  it('should duplicate workout template with custom name', async () => {
    const originalTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
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
      originalTemplateId: 'non-existent',
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was saved
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should duplicate template with empty exercises', async () => {
    const originalTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Empty Template',
      exercises: [],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      originalTemplateId: '1',
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

  it('should create independent copy of exercises array', async () => {
    const originalTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    const request = {
      originalTemplateId: '1',
    };

    const result = await usecase.execute(request);

    // Modify the duplicated template's exercises
    result.addExercise({ exerciseId: 'shoulder-press', sets: 2 });

    // Original template should be unchanged
    expect(originalTemplate.exercises).toHaveLength(1);
    expect(result.exercises).toHaveLength(2);
  });

  it('should throw error if originalTemplateId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const id of invalidIds) {
      const request = { originalTemplateId: id };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if newTemplateName is invalid', async () => {
    const invalidNames = ['', '   ', null, 8, {}, [], true, false];

    const originalTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

    for (const name of invalidNames) {
      const request = {
        originalTemplateId: '1',
        newTemplateName: name,
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });
});
