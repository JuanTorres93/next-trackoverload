import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutTemplateUsecase } from '../DeleteWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: DeleteWorkoutTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new DeleteWorkoutTemplateUsecase(workoutTemplatesRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);
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

  it('should throw error if user does not exist', async () => {
    await expect(
      usecase.execute({
        id: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      usecase.execute({
        id: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(/DeleteWorkoutTemplateUsecase.*User.*not.*found/);
  });
});
