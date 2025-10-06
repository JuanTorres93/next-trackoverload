import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutTemplateUsecase } from '../UpdateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

describe('UpdateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: UpdateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new UpdateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should update the workout template name', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Old Name',
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      id: '1',
      name: 'New Name',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('New Name');
    expect(result.id).toBe('1');
    expect(result.exercises).toEqual([{ exerciseId: 'ex1', sets: 3 }]);
    expect(result.createdAt).toEqual(existingTemplate.createdAt);
    expect(result.updatedAt).not.toEqual(existingTemplate.updatedAt);

    // Verify it was saved in the repo
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      '1'
    );
    expect(savedTemplate!.name).toBe('New Name');
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      id: 'non-existent',
      name: 'New Name',
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if name is invalid', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Old Name',
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const invalidNames = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidName of invalidNames) {
      const request = {
        id: '1',
        name: invalidName,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if id is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        id: invalidId,
        name: 'Valid Name',
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });
});
