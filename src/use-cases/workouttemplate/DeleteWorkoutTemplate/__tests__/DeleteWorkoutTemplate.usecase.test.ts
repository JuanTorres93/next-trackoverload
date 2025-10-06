import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutTemplateUsecase } from '../DeleteWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';

describe('DeleteWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: DeleteWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new DeleteWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should soft delete the workout template when it exists', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    await usecase.execute({ id: '1' });

    // Verify template was soft deleted (not accessible via normal getter)
    const deletedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      '1'
    );
    expect(deletedTemplate).toBeNull();

    // But still exists when including deleted templates
    const templateIncludingDeleted =
      workoutTemplatesRepo.workoutTemplatesForTesting.find((t) => t.id === '1');
    expect(templateIncludingDeleted).not.toBeNull();
    expect(templateIncludingDeleted?.isDeleted).toBe(true);
    expect(templateIncludingDeleted?.deletedAt).toBeDefined();
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    await expect(usecase.execute({ id: 'non-existent' })).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw error if id is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const id of invalidIds) {
      const request = { id };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw error if workout template is deleted', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    await usecase.execute({ id: '1' });

    await expect(usecase.execute({ id: '1' })).rejects.toThrow(NotFoundError);
  });
});
