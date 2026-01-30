import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutTemplateUsecase } from '../DeleteWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('DeleteWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: DeleteWorkoutTemplateUsecase;
  let user: User;
  let existingTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new DeleteWorkoutTemplateUsecase(workoutTemplatesRepo, usersRepo);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    existingTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe('Execution', () => {
    it('should soft delete the workout template when it exists because workout references template id', async () => {
      await usecase.execute({
        id: existingTemplate.id,
        userId: userTestProps.userId,
      });

      // Verify template was soft deleted (not accessible via normal getter)
      const deletedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        existingTemplate.id,
      );
      expect(deletedTemplate).toBeNull();

      // But still exists in repo
      const templateIncludingDeleted =
        workoutTemplatesRepo.workoutTemplatesForTesting.find(
          (t) => t.id === existingTemplate.id,
        );
      expect(templateIncludingDeleted).not.toBeNull();
      expect(templateIncludingDeleted?.isDeleted).toBe(true);
      expect(templateIncludingDeleted?.deletedAt).toBeDefined();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout template does not exist', async () => {
      const request = { id: 'non-existent', userId: userTestProps.userId };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/,
      );
    });

    it('should throw error if workout template is already deleted', async () => {
      const request = { id: existingTemplate.id, userId: userTestProps.userId };

      // Delete it first
      await usecase.execute(request);

      // Try deleting it again
      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: 'some-id',
        userId: 'non-existent',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to delete another user's template", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'user-2',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        id: existingTemplate.id,
        userId: anotherUser.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/,
      );
    });
  });
});
