import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutTemplateUsecase } from '../DeleteWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: DeleteWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new DeleteWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should soft delete the workout template when it exists', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    await usecase.execute({ id: existingTemplate.id, userId: vp.userId });

    // Verify template was soft deleted (not accessible via normal getter)
    const deletedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      existingTemplate.id
    );
    expect(deletedTemplate).toBeNull();

    // But still exists when including deleted templates
    const templateIncludingDeleted =
      workoutTemplatesRepo.workoutTemplatesForTesting.find(
        (t) => t.id === existingTemplate.id
      );
    expect(templateIncludingDeleted).not.toBeNull();
    expect(templateIncludingDeleted?.isDeleted).toBe(true);
    expect(templateIncludingDeleted?.deletedAt).toBeDefined();
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    await expect(
      usecase.execute({ id: 'non-existent', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
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
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    await usecase.execute({ id: existingTemplate.id, userId: vp.userId });

    await expect(
      usecase.execute({ id: existingTemplate.id, userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const userId of invalidUserIds) {
      const request = { id: 'some-id', userId };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });
});
